import { Map as MapLibreMap } from 'maplibre-gl';
import { EmergencyRoute, VehicleTelemetry, CameraFollowMode } from '../../types/navigation';
import { OsmRoutePlanner } from '../routing/OsmRoutePlanner';
import { VoiceGuidanceService } from './VoiceGuidanceService';

export class VehicleSimulator {
  private map: MapLibreMap | null = null;
  private route: EmergencyRoute | null = null;
  private animFrameId: number | null = null;
  private isRunning: boolean = false;

  private currentCoordIndex: number = 0;
  private currentProgress: number = 0; // 0 to 1 between points
  private speedFactor: number = 1;
  private cameraMode: CameraFollowMode = 'follow';
  private voiceEnabled: boolean = true;
  private voiceVolume: number = 1.0;

  private lastSpokenStepId: string | null = null;
  private onTelemetryUpdate?: (telemetry: VehicleTelemetry) => void;
  private onArrival?: () => void;
  private onOffRoute?: () => void;

  constructor(map: MapLibreMap | null) {
    this.map = map;
  }

  public setMap(map: MapLibreMap | null): void {
    this.map = map;
  }

  public setVoiceSettings(enabled: boolean, volume: number): void {
    this.voiceEnabled = enabled;
    this.voiceVolume = volume;
  }

  public setSpeedFactor(factor: number): void {
    this.speedFactor = factor;
  }

  public setCameraMode(mode: CameraFollowMode): void {
    this.cameraMode = mode;
  }

  /**
   * Start simulation along route
   */
  public start(
    route: EmergencyRoute,
    onTelemetry: (t: VehicleTelemetry) => void,
    onArrival: () => void,
    onOffRoute: () => void
  ): void {
    this.stop();
    this.route = route;
    this.onTelemetryUpdate = onTelemetry;
    this.onArrival = onArrival;
    this.onOffRoute = onOffRoute;
    this.currentCoordIndex = 0;
    this.currentProgress = 0;
    this.isRunning = true;
    this.lastSpokenStepId = null;

    if (this.voiceEnabled && route.steps.length > 0) {
      VoiceGuidanceService.speak(`Starting emergency navigation along ${route.name}. Drive safely.`, this.voiceVolume);
    }

    this.loop();
  }

  public pause(): void {
    this.isRunning = false;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  public resume(): void {
    if (!this.isRunning && this.route) {
      this.isRunning = true;
      this.loop();
    }
  }

  public stop(): void {
    this.pause();
    this.currentCoordIndex = 0;
    this.currentProgress = 0;
    this.route = null;
  }

  private loop = (): void => {
    if (!this.isRunning || !this.route || this.route.geometry.length < 2) return;

    const geom = this.route.geometry;

    if (this.currentCoordIndex >= geom.length - 1) {
      // Arrived at destination
      this.isRunning = false;
      const lastPt = geom[geom.length - 1];

      if (this.onTelemetryUpdate) {
        this.onTelemetryUpdate({
          coordinates: lastPt,
          bearing: 0,
          speedKmh: 0,
          currentStepIndex: this.route.steps.length - 1,
          distanceToNextManeuverMeters: 0,
          remainingDistanceMeters: 0,
          remainingDurationSeconds: 0,
          progressPercentage: 100,
          currentStreetName: 'Destination Arrived',
          isOffRoute: false,
        });
      }

      if (this.voiceEnabled) {
        VoiceGuidanceService.playChime('arrival');
        VoiceGuidanceService.speak('You have arrived at your disaster response destination.', this.voiceVolume);
      }

      if (this.onArrival) {
        this.onArrival();
      }
      return;
    }

    // Step interpolation logic
    const stepIncrement = 0.04 * this.speedFactor;
    this.currentProgress += stepIncrement;

    if (this.currentProgress >= 1) {
      this.currentProgress = 0;
      this.currentCoordIndex++;
    }

    const currIdx = Math.min(this.currentCoordIndex, geom.length - 2);
    const p1 = geom[currIdx];
    const p2 = geom[currIdx + 1];

    const currentLng = p1[0] + (p2[0] - p1[0]) * this.currentProgress;
    const currentLat = p1[1] + (p2[1] - p1[1]) * this.currentProgress;
    const currentCoord: [number, number] = [currentLng, currentLat];

    const bearing = OsmRoutePlanner.calculateBearing(p1, p2);

    // Remaining calculations
    let remainingDist = 0;
    for (let i = currIdx; i < geom.length - 1; i++) {
      if (i === currIdx) {
        remainingDist += OsmRoutePlanner.haversineMeters(currentCoord, geom[i + 1]);
      } else {
        remainingDist += OsmRoutePlanner.haversineMeters(geom[i], geom[i + 1]);
      }
    }

    const currentSpeedKmh = Math.round(55 * this.speedFactor);
    const remainingDur = Math.round((remainingDist / (currentSpeedKmh * 1000 / 3600)));
    const totalDist = this.route.totalDistanceMeters;
    const progressPct = Math.min(100, Math.round(((totalDist - remainingDist) / totalDist) * 100));

    // Find current step
    let currentStepIdx = 0;
    let distToManeuver = 0;
    let currentStreet = 'Emergency Route Segment';

    if (this.route.steps.length > 0) {
      for (let s = 0; s < this.route.steps.length; s++) {
        const step = this.route.steps[s];
        const stepDist = OsmRoutePlanner.haversineMeters(currentCoord, step.coordinates);

        if (stepDist < 250 || s === this.route.steps.length - 1) {
          currentStepIdx = s;
          distToManeuver = Math.round(stepDist);
          currentStreet = step.streetName;

          // Trigger voice prompt for upcoming step
          if (this.voiceEnabled && this.lastSpokenStepId !== step.id && distToManeuver < 120 && distToManeuver > 20) {
            this.lastSpokenStepId = step.id;
            VoiceGuidanceService.playChime('maneuver');
            VoiceGuidanceService.speak(`In ${distToManeuver} meters, ${step.instruction}`, this.voiceVolume);
          }
          break;
        }
      }
    }

    // Telemetry callback
    const telemetry: VehicleTelemetry = {
      coordinates: currentCoord,
      bearing,
      speedKmh: currentSpeedKmh,
      currentStepIndex: currentStepIdx,
      distanceToNextManeuverMeters: distToManeuver,
      remainingDistanceMeters: Math.round(remainingDist),
      remainingDurationSeconds: remainingDur,
      progressPercentage: progressPct,
      currentStreetName: currentStreet,
      isOffRoute: false,
    };

    if (this.onTelemetryUpdate) {
      this.onTelemetryUpdate(telemetry);
    }

    // Camera follow mode updates
    if (this.map) {
      if (this.cameraMode === 'follow') {
        this.map.easeTo({
          center: currentCoord,
          bearing: bearing,
          pitch: 45,
          zoom: 16,
          duration: 200,
        });
      } else if (this.cameraMode === 'north_up') {
        this.map.easeTo({
          center: currentCoord,
          bearing: 0,
          pitch: 0,
          zoom: 15.5,
          duration: 200,
        });
      }
    }

    this.animFrameId = requestAnimationFrame(this.loop);
  };
}

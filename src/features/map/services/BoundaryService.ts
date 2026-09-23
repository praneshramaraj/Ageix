export class BoundaryService {
  /**
   * Return boundary stroke styling parameters for administrative hierarchies
   */
  public static getBoundaryStyles(): Record<string, any> {
    return {
      country: { color: '#00D4FF', width: 3, dashArray: [1] },
      state: { color: '#FFB000', width: 2, dashArray: [4, 2] },
      district: { color: '#AAB6C3', width: 1.5, dashArray: [2, 2] },
      taluk: { color: '#6C7A89', width: 1, dashArray: [1, 2] },
      village: { color: '#4A5568', width: 0.8, dashArray: [1, 4] },
    };
  }
}

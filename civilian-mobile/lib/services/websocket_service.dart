import 'dart:async';
import 'dart:convert';
import 'package:flutter/widgets.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
import '../core/config/app_config.dart';

class WebSocketService with WidgetsBindingObserver {
  WebSocketChannel? _channel;
  Function(dynamic)? onMessageCallback;
  Function(bool)? onConnectionStateChanged;

  bool _isConnected = false;
  bool _isDisposed = false;
  int _reconnectAttempts = 0;
  Timer? _reconnectTimer;
  Timer? _heartbeatTimer;
  final Set<String> _processedEvents = {};

  bool get isConnected => _isConnected;

  WebSocketService() {
    WidgetsBinding.instance.addObserver(this);
  }

  void connect({
    String? url,
    Function(dynamic)? onMessage,
    Function(bool)? onStateChange,
  }) {
    if (_isDisposed) return;
    if (onMessage != null) onMessageCallback = onMessage;
    if (onStateChange != null) onConnectionStateChanged = onStateChange;

    final targetUrl = url ?? AppConfig.websocketUrl;
    _cleanUpChannel();

    try {
      _channel = WebSocketChannel.connect(Uri.parse(targetUrl));
      _isConnected = true;
      _reconnectAttempts = 0;
      _notifyState(true);

      _startHeartbeat();

      _channel!.stream.listen(
        (message) {
          _handleIncomingMessage(message);
        },
        onError: (error) {
          _handleDisconnect();
        },
        onDone: () {
          _handleDisconnect();
        },
      );
    } catch (e) {
      _handleDisconnect();
    }
  }

  void _handleIncomingMessage(dynamic message) {
    try {
      final data = jsonDecode(message);
      if (data is Map) {
        // Event deduplication check
        final String eventId =
            data['eventId'] ??
            data['id'] ??
            '${data['type']}_${data['payload']?['id']}_${data['payload']?['status']}';

        if (_processedEvents.contains(eventId)) {
          return;
        }
        _processedEvents.add(eventId);
        if (_processedEvents.length > 200) {
          _processedEvents.remove(_processedEvents.first);
        }

        if (onMessageCallback != null) {
          onMessageCallback!(data);
        }
      }
    } catch (_) {}
  }

  void _startHeartbeat() {
    _heartbeatTimer?.cancel();
    _heartbeatTimer = Timer.periodic(const Duration(seconds: 25), (timer) {
      if (_isConnected && _channel != null) {
        try {
          _channel!.sink.add(
            jsonEncode({
              'type': 'PING',
              'timestamp': DateTime.now().toIso8601String(),
            }),
          );
        } catch (_) {
          _handleDisconnect();
        }
      }
    });
  }

  void _handleDisconnect() {
    if (_isDisposed) return;
    final wasConnected = _isConnected;
    _isConnected = false;
    _heartbeatTimer?.cancel();
    _cleanUpChannel();

    if (wasConnected) {
      _notifyState(false);
    }

    _scheduleReconnect();
  }

  void _scheduleReconnect() {
    if (_isDisposed) return;
    _reconnectTimer?.cancel();
    _reconnectAttempts++;

    // Exponential backoff: 2s, 4s, 8s, 16s (max 30s)
    final backoffSeconds = (_reconnectAttempts * 2).clamp(2, 30);
    _reconnectTimer = Timer(Duration(seconds: backoffSeconds), () {
      connect();
    });
  }

  void sendSos(Map<String, dynamic> sosPayload) {
    if (_isConnected && _channel != null) {
      try {
        _channel!.sink.add(
          jsonEncode({
            'type': 'TRIGGER_SOS',
            'payload': sosPayload,
            'timestamp': DateTime.now().toIso8601String(),
          }),
        );
      } catch (_) {}
    }
  }

  void _notifyState(bool connected) {
    if (onConnectionStateChanged != null) {
      onConnectionStateChanged!(connected);
    }
  }

  void _cleanUpChannel() {
    try {
      _channel?.sink.close();
    } catch (_) {}
    _channel = null;
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      if (!_isConnected) {
        connect();
      }
    }
  }

  void dispose() {
    _isDisposed = true;
    WidgetsBinding.instance.removeObserver(this);
    _heartbeatTimer?.cancel();
    _reconnectTimer?.cancel();
    _cleanUpChannel();
  }
}

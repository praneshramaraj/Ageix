import 'dart:convert';
import 'package:web_socket_channel/web_socket_channel.dart';

class WebSocketService {
  WebSocketChannel? _channel;
  Function(dynamic)? onMessageCallback;

  void connect(String url, {Function(dynamic)? onMessage}) {
    try {
      onMessageCallback = onMessage;
      _channel = WebSocketChannel.connect(Uri.parse(url));

      _channel!.stream.listen(
        (message) {
          try {
            final data = jsonDecode(message);
            print('[Flutter WebSocket] Received: ${data['type']}');
            if (onMessageCallback != null) {
              onMessageCallback!(data);
            }
          } catch (e) {
            print('[Flutter WebSocket] Json decode error: $e');
          }
        },
        onError: (error) {
          print('[Flutter WebSocket] Stream error: $error');
        },
        onDone: () {
          print('[Flutter WebSocket] Connection closed');
        },
      );
    } catch (e) {
      print('[Flutter WebSocket] Connect error: $e');
    }
  }

  void sendSos(Map<String, dynamic> sosPayload) {
    if (_channel != null) {
      _channel!.sink.add(jsonEncode({
        'type': 'TRIGGER_SOS',
        'payload': sosPayload,
      }));
    }
  }

  void dispose() {
    _channel?.sink.close();
  }
}

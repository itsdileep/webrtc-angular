import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-webrtc',
  templateUrl: './webrtc.component.html',
  styleUrls: ['./webrtc.component.css']
})
export class WebrtcComponent {
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;

  private localStream!: MediaStream;
  private remoteStream!: MediaStream;
  private peerConnection!: RTCPeerConnection;

  constructor() { }

  async getLocalMedia() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      this.localVideo.nativeElement.srcObject = this.localStream;
    } catch (error) {
      console.error('Error accessing local media:', error);
    }
  }

  createOffer() {
    this.getLocalMedia();
    this.peerConnection = new RTCPeerConnection();

    this.localStream.getTracks().forEach(track => {
      this.peerConnection.addTrack(track, this.localStream);
    });

    this.peerConnection.createOffer()
      .then(offer => this.peerConnection.setLocalDescription(offer))
      .then(() => {
        // Send the offer to the remote peer
      })
      .catch(error => console.error('Error creating offer:', error));
  }

  handleAnswer(answer: RTCSessionDescriptionInit) {
    this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
      .catch(error => console.error('Error setting remote description:', error));
  }

  handleIceCandidate(event: RTCPeerConnectionIceEvent) {
    if (event.candidate) {
      // Send the ICE candidate to the remote peer
    }
  }

  endCall() {
    this.localStream.getTracks().forEach(track => track.stop());
    this.remoteStream.getTracks().forEach(track => track.stop());
    this.peerConnection.close();
  }
}

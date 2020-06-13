import { Component, OnInit } from '@angular/core';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sample3',
  templateUrl: './sample3.component.html',
  styleUrls: ['./sample3.component.less']
})
export class Sample3Component implements OnInit {

  showCanvas: HTMLCanvasElement;
  model: cocoSsd.ObjectDetection;
  message: string;
  imgURL: string;
  mediaStream;

  constructor(private http: HttpClient) { }

  async ngOnInit() {

    this.imgURL = 'assets/inputimg2.jpg';
    const showDiv = document.getElementById('myCanvas');
    this.showCanvas = document.createElement('canvas');
    this.showCanvas.width = showDiv.clientWidth;
    this.showCanvas.height = showDiv.clientHeight;
    this.showCanvas.id = 'showCanvas';
    showDiv.appendChild(this.showCanvas);

    //this.getUserMedia();

  }

  videoTimeupdate() {

    const showCanvas = document.getElementById('showCanvas') as HTMLCanvasElement;
    const showContext = showCanvas.getContext( '2d' );
    const video = document.getElementById('video') as HTMLVideoElement;
    showContext.drawImage(video, 0, 0, showCanvas.clientWidth,showCanvas.clientHeight);
    this.detect();

  }
  async loadModel() {
    this.message = 'model loading';
    this.model = await cocoSsd.load();
    this.message = 'model loaded';
  }

  changeImg() {

    this.message = 'pic loading';
    const img = document.getElementById('inputimg');
    this.imgURL = (document.getElementById('imgURL') as HTMLInputElement).value;//getAttribute('value');
    (img as HTMLImageElement).src = this.imgURL;//inputimg2.jpg';
  }

  imgLoad(){

    const img = document.getElementById('inputimg');

    // 将图片画到canvas上面上去！
    const showContext = this.showCanvas.getContext( '2d' );
    showContext.clearRect(0, 0, this.showCanvas.width, this.showCanvas.height);
    showContext.drawImage((img as HTMLImageElement), 0, 0, img.getClientRects()[0].width, img.getClientRects()[0].height);
    this.message = 'pic loaded';
  }

  async detect() {

    const video = document.getElementById('video') as HTMLVideoElement;
    const showContext = this.showCanvas.getContext( '2d' );
    const predictions = await this.model.detect(this.showCanvas);
    // console.log('Predictions: ');
    // console.log(predictions);

    predictions.forEach((value, index, array) => {

      showContext.beginPath();
      showContext.rect(value.bbox[0], value.bbox[1], value.bbox[2], value.bbox[3]);
      showContext.lineWidth = 2;
      showContext.strokeStyle = 'red';
      showContext.stroke();
      showContext.font = 'italic bold 36px Arial';
      showContext.strokeText(value.class, value.bbox[0], value.bbox[1]);

      //console.log(value.class + ':' + value.score, value.bbox[0], value.bbox[1]);
    });
    this.message = 'end detect';
  }

  getUserMedia() {
    // 选择最接近360x540的分辨率
    const constraints = { video: { width: 1024, height: 768, deviceId: '1' } };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(mediaStream => {
        this.mediaStream = mediaStream;

        /* var video = document.querySelector('video'); */
        const video: any = document.getElementById('video');
        video.srcObject = mediaStream;
        video.onloadedmetadata = function(e) {
          video.play();
        };
      })
      .catch(function(err) {
        console.log(err.name + ': ' + err.message);
      }); // 最后一定要检查错误。
  }

  /**关闭摄像头 */
  closeCamera() {
    this.mediaStream.getTracks().forEach(track => track.stop());
  }

}
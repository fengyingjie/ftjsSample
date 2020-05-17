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

  constructor(private http: HttpClient) { }

  ngOnInit() {

    const showDiv = document.getElementById('myCanvas');
    this.showCanvas = document.createElement('canvas');
    showDiv.appendChild(this.showCanvas);
  
  }
  async loadModel() {
    this.message = 'model loading';
    this.model = await cocoSsd.load();
    this.message = 'model loaded';
  }

  async detect(){
    
    const showContext = this.showCanvas.getContext( '2d' );
    let imgDate = new Image();		
    imgDate.onload  = function(){
      // 将图片画到canvas上面上去！			
      showContext.drawImage(imgDate,100,100);
    }; 			
    imgDate.src = 'assets/inputimg2.jpg';
    // const getImage = this.http.get('assets/inputimg2.jpg', { responseType: 'blob' });
    // await getImage.toPromise().then( data => {
    //   showContext.drawImage(data,100,100);
    // });

    // this.message = 'start detect';
    // const img = document.getElementById('inputimg');
    // // Classify the image.
    // const predictions = await this.model.detect(img as HTMLCanvasElement);

    const predictions = await this.model.detect(this.showCanvas);
    
    console.log('Predictions: ');
    console.log(predictions);

    predictions.forEach((value,index,array)=>{
      
      showContext.fillRect(value.bbox[0],value.bbox[1],value.bbox[2],value.bbox[3]);
      //this.drawBox(showContext,value.bbox);
    });
    this.message = 'end detect';
  }

  // drawBox(context:CanvasRenderingContext2D,bbox:[number, number, number, number]){
  //   context.fillRect(bbox);
  // }
}

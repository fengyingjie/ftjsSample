import { Component, OnInit } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
//import * as tfvis from '@tensorflow/tfjs-vis';

@Component({
  selector: 'app-sampleone',
  templateUrl: './sampleone.component.html',
  styleUrls: ['./sampleone.component.less']
})
export class SampleoneComponent implements OnInit {

  protected result: string;

  constructor() { }

  ngOnInit() {
    this.run();
  }

  async run() {
    // Create a simple model.
    const model = tf.sequential();
    model.add(tf.layers.dense({units: 1, inputShape: [1]}));

    // Prepare the model for training: Specify the loss and the optimizer.
    model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

    // Generate some synthetic data for training. (y = 2x - 1)
    const xs = tf.tensor2d([-1, 0, 1, 2, 3, 4, 5, 6, 7, 8], [10, 1]);
    const ys = tf.tensor2d([-3, -1, 1, 3, 5, 7, 9, 11, 13, 15], [10, 1]);

    const surface = { name: 'show.fitCallbacks', tab: 'Training' };

    // Train the model using the data.
    // const history = await model.fit(xs, ys, 
    //   {  epochs: 250,
    //      callbacks: tfvis.show.fitCallbacks(surface, ['loss', 'acc'])
    //   });
    const history = await model.fit(xs, ys, {epochs: 1500});

    // Use the model to do inference on a data point the model hasn't seen.
    // Should print approximately 39.
    this.result = model.predict(tf.tensor2d([40], [1, 1])).toString();

    const loss = history.history.loss;
    const accuracy = history.history.acc;

    //const lossValues = [[], []];
    //const lossValues.push({x: accuracy, y: loss});
 
    const lossContainer = document.getElementById('loss-canvas');

    // const data = [[
    //   { x: 0, y: 0 },
    //   { x: 1, y: 1 },
    //   { x: 2, y: 2 }
    // ],[
    //   { x: 0, y: 0 },
    //   { x: 1, y: 1 },
    //   { x: 2, y: 2 }
    // ]];

    // tfvis.render.linechart(
    //   lossContainer, 
    //   {values:data, series:['ss','dd']},
    //   {
    //     xLabel: 'Batch #',
    //     yLabel: 'Loss',
    //     width: 400,
    //     height: 300,
    //   }
    //   );
  }

}

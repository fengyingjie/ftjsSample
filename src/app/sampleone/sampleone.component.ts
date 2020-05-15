import { Component, OnInit } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';

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

    //const surface = { name: 'show.fitCallbacks', tab: 'Training' };

    // Train the model using the data.
    //const history = await model.fit(xs, ys, {epochs: 250, callbacks: tfvis.show.fitCallbacks(surface, ['loss', 'acc'])});
    const history = await model.fit(xs, ys, {epochs: 1500});

    // Use the model to do inference on a data point the model hasn't seen.
    // Should print approximately 39.
    this.result = model.predict(tf.tensor2d([40], [1, 1])).toString();

    const loss = history.history.loss;
    const accuracy = history.history.acc;

    // const lossValues: {x: number, y: number}[];
    // lossValues.push({x: accuracy[0], y: loss});
    const lossContainer = document.getElementById('loss-canvas');

    const data1 = {values : [
      { x: 0, y: history.history.loss[0] },
      { x: 1, y: history.history.loss[1] },
      { x: 2, y: history.history.loss[2] }
    ]
   };

  //const ;
    //tfvis.show.modelSummary(tfvis.visor().surface({ name: 'Model Summary', tab: 'Model Inspection'}), model);

    const accuracyValues = [[], []];
    accuracyValues[0].push({x: loss, y: accuracy});
    tfvis.render.linechart(
    lossContainer,
       data1, {
         xLabel: 'Batch #',
         yLabel: 'Accuracy',
         width: 400,
         height: 300,
       });



//     const data = [
//       { index: 0, value: 50 },
//       { index: 1, value: 100 },
//       { index: 2, value: 150 },
//     ];

//     // Get a surface
// const surface = tfvis.visor().surface({ name: 'Barchart', tab: 'Charts' });

// // Render a barchart on that surface
// tfvis.render.barchart(data, surface, {});

    // tfvis.render.linechart(
    //   lossContainer,
    //   data1,
    //   {
    //     xLabel: 'Batch #',
    //     yLabel: 'Loss',
    //     width: 400,
    //     height: 300,
    //   });
  }

}

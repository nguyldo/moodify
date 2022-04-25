/* eslint-disable max-len */
import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
);

export default function MoodStatistics({ data }) {
  const { excited, content, happy, bad, sad, angry, labels, numLogins } = data;

  console.log('numLogins');
  console.log(numLogins);

  console.log(data);

  const counts = {
    excited: excited ? excited.count : 0,
    content: content ? content.count : 0,
    happy: happy ? happy.count : 0,
    bad: bad ? bad.count : 0,
    sad: sad ? sad.count : 0,
    angry: angry ? angry.count : 0,
  };

  const pieData = {
    labels: ['Excited', 'Content', 'Happy', 'Bad', 'Sad', 'Angry'],
    datasets: [
      {
        label: '# of times selected',
        data: [counts.excited, counts.content, counts.happy, counts.bad, counts.sad, counts.angry],
        backgroundColor: [
          'rgba(237, 106, 32, 0.6)',
          'rgba(38, 207, 55, 0.6)',
          'rgba(243, 210, 38, 0.6)',
          'rgba(161, 54, 244, 0.6)',
          'rgba(61, 147, 249, 0.6)',
          'rgba(242, 45, 45, 0.6)',
        ],
        borderColor: [
          'rgba(237, 106, 32, 1)',
          'rgba(38, 207, 55, 1)',
          'rgba(243, 210, 38, 1)',
          'rgba(161, 54, 244, 1)',
          'rgba(61, 147, 249, 1)',
          'rgba(242, 45, 45, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const zeroArray = labels.map(() => 0);

  const countsOverTime = {
    Excited: excited ? labels.map((time) => (excited.timestamps[time] ? excited.timestamps[time] : 0)) : zeroArray,
    Content: content ? labels.map((time) => (content.timestamps[time] ? content.timestamps[time] : 0)) : zeroArray,
    Happy: happy ? labels.map((time) => (happy.timestamps[time] ? happy.timestamps[time] : 0)) : zeroArray,
    Bad: bad ? labels.map((time) => (bad.timestamps[time] ? bad.timestamps[time] : 0)) : zeroArray,
    Sad: sad ? labels.map((time) => (sad.timestamps[time] ? sad.timestamps[time] : 0)) : zeroArray,
    Angry: angry ? labels.map((time) => (angry.timestamps[time] ? angry.timestamps[time] : 0)) : zeroArray,
  };

  const moods = ['Excited', 'Content', 'Happy', 'Bad', 'Sad', 'Angry'];

  const backgroundColor = {
    Excited: 'rgba(237, 106, 32, 0.6)',
    Content: 'rgba(38, 207, 55, 0.6)',
    Happy: 'rgba(243, 210, 38, 0.6)',
    Bad: 'rgba(161, 54, 244, 0.6)',
    Sad: 'rgba(61, 147, 249, 0.6)',
    Angry: 'rgba(242, 45, 45, 0.6)',
  };

  const borderColor = {
    Excited: 'rgba(237, 106, 32, 1)',
    Content: 'rgba(38, 207, 55, 1)',
    Happy: 'rgba(243, 210, 38, 1)',
    Bad: 'rgba(161, 54, 244, 1)',
    Sad: 'rgba(61, 147, 249, 1)',
    Angry: 'rgba(242, 45, 45, 1)',
  };

  const barData = {
    labels,
    datasets: moods.map((mood) => {
      const set = {
        label: mood,
        data: countsOverTime[mood],
        backgroundColor: backgroundColor[mood],
        borderColor: borderColor[mood],
      };
      return set;
    }),
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  return (
    <div>
      <h2>Mood Statistics</h2>
      <br />
      <h3>Number of Logins</h3>
      <h1>{numLogins}</h1>
      <br />
      <h3>Number of Mood Selections</h3>
      <Pie data={pieData} />
      <br />
      <h3>Mood Selections Over Time</h3>
      <Bar options={options} data={barData} />
    </div>
  );
}

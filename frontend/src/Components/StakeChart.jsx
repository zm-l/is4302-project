import React from "react";
import {
  FlexibleXYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  VerticalBarSeries,
  LabelSeries,
} from "react-vis";

const StakeChart = ({ proposition }) => {
  const votingStakeData = [
    { x: "Voting Stake", y: proposition.votingStake?.true || 0 },
    { x: "Voting Stake", y: proposition.votingStake?.false || 0 },
  ];

  const certifyingStakeData = [
    { x: "Certifying Stake", y: proposition.certifyingStake?.true || 0 },
    { x: "Certifying Stake", y: proposition.certifyingStake?.false || 0 },
  ];

  const data = [
    ...votingStakeData.map((d, i) => ({
      ...d,
      x: `${d.x} True`,
      y: d.y,
      color: i === 0 ? "#00C49F" : "#FF8042",
    })),
    ...certifyingStakeData.map((d, i) => ({
      ...d,
      x: `${d.x} True`,
      y: d.y,
      color: i === 0 ? "#00C49F" : "#FF8042",
    })),
  ];

  const labelsData = data.map((d, i) => ({
    x: d.x,
    y: d.y + (i % 2 === 0 ? 10 : -10),
    label: d.y.toString(),
    style: { fontSize: 12, fill: "#333" },
  }));

  return (
    <FlexibleXYPlot xType="ordinal" height={300}>
      <VerticalGridLines />
      <HorizontalGridLines />
      <XAxis tickLabelAngle={-45} />
      <YAxis />
      <VerticalBarSeries data={data} colorType="literal" />
      <LabelSeries data={labelsData} getLabel={(d) => d.label} />
    </FlexibleXYPlot>
  );
};

export default StakeChart;

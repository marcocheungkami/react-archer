// @flow

import React from 'react';
import Point from './Point';

type Props = {
  startingPoint: Point,
  startingAnchorOrientation: AnchorPositionType,
  endingPoint: Point,
  endingAnchorOrientation: AnchorPositionType,
  strokeColor: string,
  strokeWidth: number,
  strokeDasharray?: string,
  arrowLabel?: ?React$Node,
  arrowMarkerId: string,
  noCurves: boolean,
  shortestPath: boolean,
  offset?: number,
  endShape: Object,
};

function computeEndingArrowDirectionVector(endingAnchorOrientation) {
  switch (endingAnchorOrientation) {
    case 'left':
      return { arrowX: -1, arrowY: 0 };
    case 'right':
      return { arrowX: 1, arrowY: 0 };
    case 'top':
      return { arrowX: 0, arrowY: -1 };
    case 'bottom':
      return { arrowX: 0, arrowY: 1 };
    default:
      return { arrowX: 0, arrowY: 0 };
  }
}

export function computeEndingPointAccordingToArrowHead(
  xArrowHeadEnd: number,
  yArrowHeadEnd: number,
  arrowLength: number,
  strokeWidth: number,
  endingAnchorOrientation: AnchorPositionType,
) {
  const endingVector = computeEndingArrowDirectionVector(endingAnchorOrientation);

  const { arrowX, arrowY } = endingVector;

  const xEnd = xArrowHeadEnd + (arrowX * arrowLength * strokeWidth) / 2;
  const yEnd = yArrowHeadEnd + (arrowY * arrowLength * strokeWidth) / 2;

  return { xEnd, yEnd };
}

export function computeStartingAnchorPosition(
  xStart: number,
  yStart: number,
  xEnd: number,
  yEnd: number,
  startingAnchorOrientation: AnchorPositionType,
): { xAnchor1: number, yAnchor1: number } {
  if (startingAnchorOrientation === 'top' || startingAnchorOrientation === 'bottom') {
    return {
      xAnchor1: xStart,
      yAnchor1: yStart + (yEnd - yStart) / 2,
    };
  }
  if (startingAnchorOrientation === 'left' || startingAnchorOrientation === 'right') {
    return {
      xAnchor1: xStart + (xEnd - xStart) / 2,
      yAnchor1: yStart,
    };
  }

  return { xAnchor1: xStart, yAnchor1: yStart };
}

export function computeEndingAnchorPosition(
  xStart: number,
  yStart: number,
  xEnd: number,
  yEnd: number,
  endingAnchorOrientation: AnchorPositionType,
): { xAnchor2: number, yAnchor2: number } {
  if (endingAnchorOrientation === 'top' || endingAnchorOrientation === 'bottom') {
    return {
      xAnchor2: xEnd,
      yAnchor2: yEnd - (yEnd - yStart) / 2,
    };
  }
  if (endingAnchorOrientation === 'left' || endingAnchorOrientation === 'right') {
    return {
      xAnchor2: xEnd - (xEnd - xStart) / 2,
      yAnchor2: yEnd,
    };
  }

  return { xAnchor2: xEnd, yAnchor2: yEnd };
}

export function computeLabelDimensions(
  xStart: number,
  yStart: number,
  xEnd: number,
  yEnd: number,
): { xLabel: number, yLabel: number, labelWidth: number, labelHeight: number } {
  const labelWidth = Math.max(Math.abs(xEnd - xStart), 1);
  const labelHeight = Math.max(Math.abs(yEnd - yStart), 1);

  const xLabel = xEnd > xStart ? xStart : xEnd;
  const yLabel = yEnd > yStart ? yStart : yEnd;

  return {
    xLabel,
    yLabel,
    labelWidth,
    labelHeight,
  };
}

function computePathString({
  xStart,
  yStart,
  xAnchor1,
  yAnchor1,
  xAnchor2,
  yAnchor2,
  xEnd,
  yEnd,
  noCurves,
  shortestPath,
  offset,
  endingAnchorOrientation,
}: {|
  xStart: number,
  yStart: number,
  xAnchor1: number,
  yAnchor1: number,
  xAnchor2: number,
  yAnchor2: number,
  xEnd: number,
  yEnd: number,
  noCurves: boolean,
  shortestPath: boolean,
  offset?: number,
  endingAnchorOrientation?: AnchorPositionType,
|}): string {
  const curveMarker = noCurves ? '' : 'C';

  // if (offset && offset > 0) {
  //   const angle = Math.atan2(yAnchor1 - yStart, xAnchor1 - xStart);

  //   const xOffset = offset * Math.cos(angle);
  //   const yOffset = offset * Math.sin(angle);

  //   xStart = xStart + xOffset;
  //   xEnd = xEnd - xOffset;

  //   yStart = yStart + yOffset;
  //   yEnd = yEnd - yOffset;
  // }

  function computeArrowDirection(endingAnchorOrientation) {
    switch (endingAnchorOrientation) {
      case 'left':
        return `${xEnd - 1},${yEnd} `;
      case 'right':
        return `${xEnd + 1},${yEnd} `;
      case 'top':
        return `${xEnd},${yEnd - 1} `;
      case 'bottom':
        return `${xEnd},${yEnd + 1} `;
      default:
        return '';
    }
  }

  console.log('endingAnchorOrientation' ,endingAnchorOrientation)
  console.log('starting point x, y', xStart, yStart)
  console.log('ending point x, y', xEnd, yEnd)
  const convertArrowDirectionParams = computeArrowDirection(endingAnchorOrientation)

  function computeCasesForOffet(offset) {
    const offsetRatio = 9
    console.log('offsetRatio', offsetRatio)
    const offset_ = offset
    const x = xEnd - xStart
    const y = yEnd - yStart
    let offsetXEnd = 0
    let offsetYEnd = 0
    let offsetX = Math.abs(x) / offsetRatio > offset_ ? offset_ : Math.abs(x) /offsetRatio
    let offsetY = Math.abs(y) / offsetRatio > offset_ ? offset_ : Math.abs(y) /offsetRatio
    if (offsetX + offsetY < (offset * 1.2)) {
      if (offsetX < offsetY) {
        offsetY = offset
      } else if (offsetX > offsetY) {
        offsetX = offset
      }
    }
    // const offsetX = Math.abs(x) /offsetRatio
    // const offsetY = Math.abs(y) /offsetRatio
    if (x > 0) {
      offsetXEnd = xEnd - offsetX
    } else if (x < 0) {
      offsetXEnd = xEnd + offsetX
    } else {
      offsetXEnd = xEnd
    }

    offsetYEnd = yEnd
    if (y > 0) {
      offsetYEnd = yEnd - offsetY
    } else if (y < 0) {
      offsetYEnd = yEnd + offsetY
    } else {
      offsetYEnd = yEnd
    }
    // const offsetXEnd = x >= 0 ? xEnd - offset : xEnd + offset
    // const offsetYEnd = y >= 0 ? yEnd - offset : yEnd + offset
    return {offsetXEnd : offsetXEnd, offsetYEnd: offsetYEnd}
  }
  const {offsetXEnd,offsetYEnd } = computeCasesForOffet(offset)
  return (
    `M${xStart},${yStart} ` +
    // (shortestPath ? convertArrowDirectionParams : `${curveMarker}${xAnchor1},${yAnchor1} ${xAnchor2},${yAnchor2} `) +
    `${offsetXEnd},${offsetYEnd}`
  );
}
const SvgArrow = ({
  startingPoint,
  startingAnchorOrientation,
  endingPoint,
  endingAnchorOrientation,
  strokeColor,
  strokeWidth,
  strokeDasharray,
  arrowLabel,
  arrowMarkerId,
  noCurves,
  shortestPath,
  offset,
  endShape,
}: Props) => {
  console.log('endShape', endShape)
  const actualArrowLength = endShape.circle
    ? endShape.circle.radius * 2
    : endShape.arrow.arrowLength * 2;

  const xStart = startingPoint.x;
  const yStart = startingPoint.y;

  const endingPointWithArrow = computeEndingPointAccordingToArrowHead(
    endingPoint.x,
    endingPoint.y,
    actualArrowLength,
    strokeWidth,
    endingAnchorOrientation,
  );
  const { xEnd, yEnd } = endingPointWithArrow;

  const startingPosition = computeStartingAnchorPosition(
    xStart,
    yStart,
    xEnd,
    yEnd,
    startingAnchorOrientation,
  );
  const { xAnchor1, yAnchor1 } = startingPosition;

  const endingPosition = computeEndingAnchorPosition(
    xStart,
    yStart,
    xEnd,
    yEnd,
    endingAnchorOrientation,
  );
  const { xAnchor2, yAnchor2 } = endingPosition;

  const pathString = computePathString({
    xStart,
    yStart,
    xAnchor1,
    yAnchor1,
    xAnchor2,
    yAnchor2,
    xEnd,
    yEnd,
    noCurves,
    shortestPath,
    offset,
    endingAnchorOrientation,
  });

  const { xLabel, yLabel, labelWidth, labelHeight } = computeLabelDimensions(
    xStart,
    yStart,
    xEnd,
    yEnd,
  );

  return (
    <g>
      <path
        d={pathString}
        style={{ fill: 'none', stroke: strokeColor, strokeWidth, strokeDasharray }}
        markerEnd={`url(${location.href.split('#')[0]}#${arrowMarkerId})`}
      />
      {arrowLabel && (
        <foreignObject
          x={xLabel}
          y={yLabel}
          width={labelWidth}
          height={labelHeight}
          style={{ overflow: 'visible', pointerEvents: 'none' }}
        >
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translateX(-50%) translateY(-50%)',
              pointerEvents: 'all',
            }}
          >
            <div>{arrowLabel}</div>
          </div>
        </foreignObject>
      )}
    </g>
  );
};

export default SvgArrow;

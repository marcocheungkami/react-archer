import React from 'react';
import ArcherContainer from '../src/ArcherContainer';
import ArcherElement from '../src/ArcherElement';

const rootStyle = { display: 'flex', justifyContent: 'center' };
const rowStyle = {
  margin: '200px 0',
  display: 'flex',
  justifyContent: 'space-between',
};
const boxStyle = { padding: '10px', border: '1px solid black', width: 50, height: 50 };

const FirstExample = () => {
  return (
    <div style={{ height: '500px', margin: '50px' }}>
      <ArcherContainer strokeColor="red" offset={50}>
        <div style={rootStyle}>
          <ArcherElement
            id="root"
            relations={[
              {
                targetId: 'element2',
                targetAnchor: 'middle',
                sourceAnchor: 'middle',
                style: { strokeDasharray: '5,5' },
              },
            ]}
          >
            <div style={boxStyle}>Root</div>
          </ArcherElement>
        </div>

        <div style={rowStyle}>
          <ArcherElement
            id="element2"
            relations={[
              {
                targetId: 'element3',
                targetAnchor: 'middle',
                sourceAnchor: 'middle',
                style: { strokeColor: 'blue', strokeWidth: 1 },
                label: <div style={{ marginTop: '-20px' }}>Arrow 2</div>,
              },
            ]}
          >
            <div style={boxStyle}>Element 2</div>
          </ArcherElement>

          <ArcherElement id="element3">
            <div style={boxStyle}>Element 3</div>
          </ArcherElement>

          <ArcherElement
            id="element4"
            relations={[
              {
                targetId: 'root',
                targetAnchor: 'middle',
                sourceAnchor: 'middle',
                label: 'Arrow 3',
              },
            ]}
          >
            <div style={boxStyle}>Element 4</div>
          </ArcherElement>
        </div>
      </ArcherContainer>
    </div>
  );
};

export default FirstExample;

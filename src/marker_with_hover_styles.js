const K_SIZE = 40;

const markerStyle = {
  // initially any map object has left top corner at lat lng coordinates
  // it's on you to set object origin to 0,0 coordinates
  position: 'absolute',
  // width: K_SIZE * 3,
  // height: K_SIZE * 2,
  // left: -K_SIZE / 2,
  // top: -(K_SIZE * 2),
  border: '5px solid #f44336',
  backgroundColor: 'white',
  textAlign: 'center',
  color: '#3f51b5',
  fontSize: 12,
  fontWeight: 'bold',
  padding: 4,
  cursor: 'pointer',
  wordWrap: 'break-word'
};

const markerStyleHover = {
  ...markerStyle,
  border: '5px solid #3f51b5',
  color: '#f44336'
};

export {markerStyle, markerStyleHover, K_SIZE};
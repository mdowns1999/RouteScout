import Typography from '@mui/material/Typography';

const Heading = ({ level = 1, children, ...props }) => {
  const variantMap = {
    1: 'h1',
    2: 'h2',
    3: 'h3',
    4: 'h4',
    5: 'h5',
    6: 'h6',
  };

  return (
    <Typography
      variant={variantMap[level]}
      component={`h${level}`}
      gutterBottom
      {...props}
    >
      {children}
    </Typography>
  );
};

export default Heading;

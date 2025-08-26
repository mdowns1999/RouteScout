import Typography from '@mui/material/Typography';

const Paragraph = ({ children, ...props }) => (
  <Typography variant="body1" component="p" gutterBottom {...props}>
    {children}
  </Typography>
);

export default Paragraph;

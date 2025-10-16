import { AppBar, Container, Stack, Toolbar, Link } from "@mui/material";
import useIsMobile from "../../hooks/useIsMobile";
import Heading from "../../components/UI/Heading/Heading";
import Nav from "../Nav/Nav";


export default function Header() {
  const isMobile = useIsMobile();

  return (
    <AppBar>
      <Container>
        <Toolbar>
          <Stack
          direction='row'
          justifyContent='space-between'
          alignItems='center'
          width='100%'>
            <Heading>My App</Heading>
            <Stack direction='row' gap={3}>
             <Nav/>
            </Stack>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

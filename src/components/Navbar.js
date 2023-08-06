import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

function ContainerOutsideExample() {
  return (
      <Navbar expand="lg" className="bg-body-primary">
        <Container>
          <Navbar.Brand href="#">HouseHomies</Navbar.Brand>
        </Container>
      </Navbar>
  );
}

export default ContainerOutsideExample;
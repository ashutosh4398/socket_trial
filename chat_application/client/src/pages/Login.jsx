import {Alert, Button, Form, Row, Col, Stack} from "react-bootstrap";

const Login = () => {
  return (
    <>
      <Form>
        <Row style={{
            height: "100vh", 
            justifyContent: "center",
          }}
        >
          <Col xs={6}>
            <Stack gap={3}>
              <h2 className="text-center">Login</h2>
              <Form.Control type="email" placeholder="Enter your email"/>
              <Form.Control type="password" placeholder="Enter your password"/>
              <Button variant="primary" type="submit">
                Login
              </Button>
              <Alert variant="danger">
                <p>An error occured!</p>
              </Alert>
            </Stack>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default Login;

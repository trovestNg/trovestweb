import { useRouteError } from "react-router-dom";
import { Container, Col, Row, Card, Table } from "react-bootstrap";

const ErrorBoundary = () => {
    const error = useRouteError();

    return (
        <Container>
            <section>
                <h1>Error Occured</h1>
                <small>{error?.message}</small>
            </section>
        </Container>
    );
};

export default ErrorBoundary;
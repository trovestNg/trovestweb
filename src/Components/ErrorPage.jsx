import React from 'react';
import { Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


export default function ErrorPage() {
  const navigate = useNavigate()
  return (
    <Container className=''>
      Kindly refresh and go back home
      <Button onClick={() => navigate('/')}>HOME</Button>
    </Container>
  )
}

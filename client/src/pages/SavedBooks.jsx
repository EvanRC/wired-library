import { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../graphQl/queries';
import { DELETE_BOOK } from '../graphQl/mutations'; 
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  const { loading, error, data, refetch } = useQuery(GET_ME);
  const [deleteBookMutation] = useMutation(DELETE_BOOK, {
    onCompleted: () => {
      // Optionally refetch data after deleting a book
      refetch();
    }
  });

  const handleDeleteBook = async (bookId) => {
    if (!Auth.loggedIn()) {
      console.log('You must be logged in to delete a book.');
      return;
    }

    try {
      console.log('Deleting book with ID:', bookId);
      await deleteBookMutation({
        variables: { bookId },
      });
      // upon success, remove books id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error('There was an error deleting the book:', err);
    }
  };

  if (loading) return <h2>LOADING...</h2>;
  if (error) return <p>Error :(</p>;

  const userData = data.me;


  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container fluid> {/* Correct use of fluid */}
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col md="4" key={book.bookId}> {/* Key should be here */}
                <Card border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;

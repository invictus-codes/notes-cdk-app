import React, { useEffect, useState } from 'react'
import type { RouteComponentProps } from '@reach/router'
import { Link } from '@reach/router'
import { Alert, Button, Card, CardColumns } from 'react-bootstrap'
import { GATEWAY_URL } from '../config.json'
import { Loading, PageContainer } from '../components'
interface Note {
  noteId: string
  createdAt: string
  content: string
  attachment: boolean
}

export const ListNotes = (_: RouteComponentProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [notes, setNotes] = useState([])

  useEffect(() => {
    const fetchNotes = async () => {
      setIsLoading(true)
      const fetchURL = `${GATEWAY_URL}notes`

      try {
        const response = await fetch(fetchURL)
        const data = await response.json()
        setNotes(data)
      } catch (error: any) {
        setErrorMsg(`${error.toString()} - ${fetchURL}`)
      } finally {
        setIsLoading(false)
      }
    }
    fetchNotes()
  }, [])

  const renderNotes = (notes: Note[]) =>
    notes.map(note => (
      <Link key={note.noteId} to={`/notes/${note.noteId}`}>
        <Card>
          <Card.Body>
            <Card.Title>
              {note.attachment && (
                <span role="img" aria-label="attachment" className="mr-1">
                  📎
                </span>
              )}
              {note.content}
            </Card.Title>
            <Card.Subtitle className="text-muted">
              Created: {new Date(parseInt(note.createdAt)).toLocaleString()}
            </Card.Subtitle>
          </Card.Body>
        </Card>
      </Link>
    ))

  const createNewNote = () => (
    <Link key="new" to="note/new">
      <Button variant="primary" block>
        Create a new note
      </Button>
    </Link>
  )

  return (
    <PageContainer header={<div>Your Notes</div>}>
      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
      {isLoading
        ? (
        <Loading />
          )
        : (
        <div>
          <CardColumns>{renderNotes(notes)}</CardColumns>
          {createNewNote()}
        </div>
          )}
    </PageContainer>
  )
}

export default ListNotes

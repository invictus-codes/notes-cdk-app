import React, { useState } from 'react'
import { Alert, Button } from 'react-bootstrap'
import { navigate } from '@reach/router'
import { GATEWAY_URL } from '../config.json'
import { ButtonSpinner } from '../components'

const SaveNoteButton = (props: { noteId: string; noteContent: string }) => {
  const [isSaving, setIsSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSave = async (event: any) => {
    event.preventDefault()
    setIsSaving(true)

    const { noteId, noteContent } = props
    const updateNoteURL = `${GATEWAY_URL}notes/${noteId}`

    try {
      await fetch(updateNoteURL, {
        method: 'PUT',
        body: JSON.stringify({ content: noteContent }),
      })
      navigate('/')
    } catch (error: any) {
      console.error(error)
      setErrorMsg(`${error.toString()} - ${updateNoteURL} - ${noteContent}`)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
      <Button disabled={isSaving} onClick={handleSave} block>
        {isSaving ? <ButtonSpinner /> : ''}
        {isSaving ? 'Saving...' : 'Save'}
      </Button>
    </>
  )
}

export { SaveNoteButton }

import type Note from './types/Note'
import createNote from './resolvers/createNote'
import deleteNote from './resolvers/deleteNote'
import getNoteById from './resolvers/getNoteById'
import listNotes from './resolvers/listNotes'
import updateNote from './resolvers/updateNote'

interface AppSyncEvent {
  info: {
    fieldName: string
  }
  arguments: {
    noteId: string
    note: Note
  }
}

export async function handler(event: AppSyncEvent) {
  switch (event.info.fieldName) {
    case 'createNote':
      return await createNote(event.arguments.note)
    case 'getNoteById':
      return await getNoteById(event.arguments.noteId)
    case 'listNotes':
      return await listNotes()
    case 'updateNote':
      return await updateNote(event.arguments.note)
    case 'deleteNote':
      return await deleteNote(event.arguments.noteId)
    default:
      return null
  }
}

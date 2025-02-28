import { atom, useAtom } from 'jotai';
import { Note } from './note';

const noteAtom = atom<Note[]>([]);

export const useNoteStore = () => {
  const [notes, setNotes] = useAtom(noteAtom);

  const set = (newNotes: Note[]) => {
    setNotes((oldNotes) => {
      const combinedNotes = [...oldNotes, ...newNotes];

      const uniqueNotes: { [key: number]: Note } = {};
      for (const note of combinedNotes) {
        uniqueNotes[note.id] = note;
      }

      return Object.values(uniqueNotes);
    });
  };

  const getOne = (id: number) => notes.find((note) => note.id == id);

  const deleteNote = (id: number) => {
    const findChildrenIds = (parendId: number): number[] => {
      const childrenIds = notes
        .filter((note) => note.parent_document == parendId)
        .map((child) => child.id);
      return childrenIds.concat(
        ...childrenIds.map((childrenId) => findChildrenIds(childrenId))
      );
    };
    const childrenIds = findChildrenIds(id);

    setNotes((oldNotes) => {
      return oldNotes.filter((note) => ![...childrenIds, id].includes(note.id));
    });
  };
  const clear = () => setNotes([]);

  return {
    getAll: () => notes,
    getOne,
    set,
    delete: deleteNote,
    clear,
  };
};

//controller take care of the HTTP requisition, calling the service and returning a res
//do the zod valitation
const NoteService = require('../service/note.services')
const { z } = require('zod');

const createNoteSchema = z.object({
    title: z.string({ message: 'Title is required' }),
    content: z.string({ message: 'Content is required' }),
    category: z.object()
})

class NotesController {
    async createNote(req, res) {
        try {
            const validatedData = createNoteSchema.parse(req.body);

            const note = await NoteService.createNote(validatedData);

            return res.status(201).json(note);
        } catch (error) {
            if(error instanceof z.ZodError) {
                return res.status(400).json({ errors: error.errors });
            }

            return res.status(500).json({ error: error.message });

        }
    }
}

module.exports = new NotesController();
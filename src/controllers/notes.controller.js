//controller take care of the HTTP requisition, calling the service and returning a res
//do the zod valitation
const NoteService = require('../service/note.services')
const { z } = require('zod');


const createNoteValidationSchema = z.object({
    title: z.string({ required_error: 'Title is required' }),
    description: z.string({ required_error: 'description is required' }),
    category: z.string({ required_error: 'category is required' }),
}).strict()

class NotesController {
    async create(req, res) {
        try {
            const validatedData = createNoteValidationSchema.parse(req.body);
            const token = req.userId;
            console.log(req.userId)
            const note = await NoteService.createNote(validatedData, req.userId);

            return res.status(201).json(note);

        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ errors: error.errors });
            }

            return res.status(500).json(console.log("got internal error"), { error: error.message });

        }
    }


    //listar notes
    async findAll(req, res) {
        try {
            const notes = await NoteService.findAll(req.userId);
            res.status(200).json({
                message: 'Notes listed',
                notes: notes,
            });
        } catch (erro) {
            res.status(500).json({ message: 'Error to list notes', error: erro.message })
        }
    }
}

module.exports = new NotesController();
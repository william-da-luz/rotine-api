//controller take care of the HTTP requisition, calling the service and returning a res
//do the zod valitation
const NoteService = require('../service/note.services')
const { z } = require('zod');


const searchNoteSchema = z.object({
    q: z.string({ required_error: 'need something to search' }).min(1, { message: 'O parâmetro de busca não pode estar vazio' }),
}).strict()

const createNoteValidationSchema = z.object({
    title: z.string({ required_error: 'Title is required' }),
    description: z.string({ required_error: 'description is required' }),
    category: z.string({ required_error: 'category is required' }),
}).strict()

const updateNoteValidationSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    category: z.string().optional(),
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

    async delete(req, res) {
        try {
            const id = req.params.id; //catch the id by the params there are at the tourte
            const notes = await NoteService.delete(id)
            res.status(200).json({
                message: 'Note deleted',
            })
        } catch (error) {
            res.status(500).json({message: error.message})
        };
    };

    async update(req, res) {
        try{
            const id = req.params.id; 
            const validatedData = updateNoteValidationSchema.parse(req.body)

            const updatedNote = await NoteService.update(id, validatedData, req.userId);

            res.status(200).json({
                message: 'Note updated',
            })
            
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }

    async search(req, res) {
        try {
            const { q } = searchNoteSchema.parse(req.query);

            const query = req.query.q;
            console.log(query)

            const notes = await NoteService.search(query, req.userId)

            res.status(200).json({
                notes,
                message: `All the notes with ${query}`
            })

        } catch (error) {
           throw new Error(`Error to find note`)
        }
    }
}

module.exports = new NotesController();
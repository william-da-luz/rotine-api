const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class NoteService {
    async createNote(data) {
        try {
            const note = await prisma.note.create({
                data: {
                    "title": data.title,
                    "description": data.description,
                    "category": data.category,
                },
            });
            return note;
        } catch (error) {
            throw new Error('Error to create note: ', error.message)
        }
    }
}

module.exports = new NoteService();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('../helper/jwt');

class NoteService {
    async createNote(data, userId) {
        try {
            const note = await prisma.note.create({
                data: {
                    "title": data.title,
                    "description": data.description,
                    "category": data.category,
                    "userId": userId,
                },
            });
            return note;
        } catch (error) {
            throw new Error('Error to create note: ', error.message)
        }
    }

    async findAll(userId) {
        try {
            // Lista apenas as notas do user autenticado
            const notes = await prisma.note.findMany({
                where: { userId },
            });

            return notes;

        } catch (error) {
            throw new Error(`Erro ao listar notas: ${error.message}`);
        }
    }

    async delete(id, userId) {
        try {
            const note = await prisma.note.findUnique({
                where: { id: parseInt(id), userId},
            });

            if(!note) {
                throw new Error('Impossible to delete note')
            }

            await prisma.note.delete({
                where: { id: parseInt(id)},
            });
        } catch (error) {
            console.error(error);
            
            throw new Error('Error to delete note:', error.message)
        }

    }

    async update(id, data, userId) {
        try {
            const note = await prisma.note.findUnique({
                where: { id: parseInt(id), userId},
            });

            if (!note) {
                throw new Error('Nota não encontrada para atualização.');
            }

            const updatedNote = await prisma.note.update({
                where: { id: parseInt(id)},
                data: {
                    "title": data.title,
                    "description": data.description,
                    "category": data.category,
                }
            });
            return updatedNote;
        } catch (error) {  
            throw new Error(`Error to update notes  ${error.message}`);
        }
    }


    async search (query, userId) {
        try {
            const notes = await prisma.note.findMany({
                where: {
                    userId,
                    OR: [
                       {
                        title: {
                            contains: query,
                        },
                       },

                       {
                        description: {
                            contains: query,
                        },
                       },

                       {
                        category:{
                            contains: query,
                        },
                       }
                    ],
                    

                //   contains: {
                //     "title": query.title,
                //     "description": query.description,
                //     "category": query.category
                //   }
                }
            })
            return notes;
        } catch (error) {

        }

    }
    
}

module.exports = new NoteService();
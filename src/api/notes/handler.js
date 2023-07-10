/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
// const { nanoid } = require('nanoid');
// const notes = require('../../notes');

const ClientError = require('../../exceptions/ClientError');

class NotesHandler {
   constructor(service, validator) {
      this._service = service;
      this._validator = validator;
      this.postNoteHandler = this.postNoteHandler.bind(this);
      this.getNotesHandler = this.getNotesHandler.bind(this);
      this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
      this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
      this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this);
   }

   async postNoteHandler(request, h) {
      try {
        this._validator.validateNotePayload(request.payload);
        const { title = 'untitled', body, tags } = request.payload;
        const noteId = await this._service.addNote({ title, body, tags });
        const response = h.response({
          status: 'success',
          message: 'Catatan berhasil ditambahkan',
          data: {
            noteId,
          },
        });
        response.code(201);
        return response;
      } catch (error) {
        if (error instanceof ClientError) {
          const response = h.response({
            status: 'fail',
            message: error.message,
          });
          response.code(error.statusCode);
          return response;
        }
        // Server ERROR!
        const response = h.response({
          status: 'error',
          message: 'Maaf, terjadi kegagalan pada server kami.',
        });
        response.code(500);
        console.error(error);
        return response;
      }
    }

    async getNotesHandler() {
      const notes = await this._service.getNotes();
      return {
        status: 'success',
        data: {
          notes,
        },
      };
    }

    async getNoteByIdHandler(request, h) {
      try {
        const { id } = request.params;
        const note = await this._service.getNoteById(id);
        return {
          status: 'success',
          data: {
            note,
          },
        };
      } catch (error) {
        if (error instanceof ClientError) {
          const response = h.response({
            status: 'fail',
            message: error.message,
          });
          response.code(error.statusCode);
          return response;
        }

        const response = h.response({
          status: 'error',
          message: 'Maaf, terjadi kegagalan pada server kami.',
        });
        response.code(500);
        console.error(error);
        return response;
      }
    }

    async putNoteByIdHandler(request, h) {
      try {
        this._validator.validateNotePayload(request.payload);
        const { title, body, tags } = request.payload;
        const { id } = request.params;
        await this._service.editNoteById(id, { title, body, tags });
        return {
          status: 'success',
          message: 'Catatan berhasil diperbarui',
        };
      } catch (error) {
        if (error instanceof ClientError) {
          const response = h.response({
            status: 'fail',
            message: error.message,
          });
          response.code(error.statusCode);
          return response;
        }
        // Server ERROR!
        const response = h.response({
          status: 'error',
          message: 'Maaf, terjadi kegagalan pada server kami.',
        });
        response.code(500);
        console.error(error);
        return response;
      }
    }

    async deleteNoteByIdHandler(request, h) {
      try {
        const { id } = request.params;
        await this._service.deleteNoteById(id);
        return {
          status: 'success',
          message: 'Catatan berhasil dihapus',
        };
      } catch (error) {
        if (error instanceof ClientError) {
          const response = h.response({
            status: 'fail',
            message: error.message,
          });
          response.code(error.statusCode);
          return response;
        }
        // Server ERROR!
        const response = h.response({
          status: 'error',
          message: 'Maaf, terjadi kegagalan pada server kami.',
        });
        response.code(500);
        console.error(error);
        return response;
      }
    }
  }
module.exports = NotesHandler;
// const addNoteHandler = (request, h) => {
//      const { title, tags, body } = request.payload;
//      const id = nanoid(16);
//      const createdAt = new Date().toISOString();
//      const updatedAt = createdAt;
//      const newNote = {
//         title, tags, body, id, createdAt, updatedAt,
//      };
//      notes.push(newNote);
//      const isSuccess = notes.filter((note) => note.id === id).length > 0;

//      if (isSuccess) {
//         const response = h.response({
//             status: 'success',
//             message: 'Catatan berhasil ditambahkan',
//             data: {
//                 noteId : id,
//             },
//         });
//         response.code(201);
//         return response;
//      }
//      const response = h.response({
//         status: 'fail',
//         message: 'Catatan gagal ditambahkan',
//      });
//      response.code(500);
//      return response;
// };
// const getAllNotesHandler = () => ({
//    status: 'success',
//    data:{
//       notes,
//    },
// });
// const getNoteByIdHandler = (request, h) => {
//    const { id } = request.params;
//    const note = notes.filter((n) => n.id === id)[0];
//    if (note !== undefined) {
//       return {
//          status: 'success',
//          data: {
//             note,
//          },
//       };
//    }
//    const response = h.response({
//       status: 'fail',
//       message: 'Catatan tidak ditemukan',
//    });
//    response.code(404);
//    return response;
// };
// const editNoteByIdHandler = (request, h) => {
//    const { id } = request.params;
//    const { title, tags, body } = request.payload;
//    const updatedAt = new Date().toISOString();
//    const index = notes.findIndex((note) => note.id === id);
//    if (index !== -1) {
//       notes[index] = {
//          ...notes[index],
//          title,
//          tags,
//          body,
//          updatedAt,
//       };
//       const response = h.response({
//          status: 'success',
//          message: 'Catatan berhasil diperbarui',
//       });
//       response.code(200);
//       return response;
//    }
//    const response = h.response({
//       status: 'fail',
//       message: 'Gagal memperbarui catatan, ID tidak ditemukan',
//    });
//    response.code(404);
//    return response;
// };
// const deleteNoteByIdHandler = (request, h) => {
//    const { id } = request.params;
//    const index = notes.findIndex((note) => note.id === id);
//    if (index !== -1) {
//       notes.splice(index, 1);
//       const response = h.response({
//          status: 'success',
//          message: 'Catatan berhasil dihapus',
//       });
//       response.code(200);
//       return response;
//    }
//    const response = h.response({
//       status: 'fail',
//       message: 'Catatan gagal dihapus. ID tidak ditemukan',
//    });
//    response.code(404);
//    return response;
// };
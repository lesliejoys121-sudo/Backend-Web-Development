const { Prisma } = require('@prisma/client');

function toApplicationError(error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      const conflict = new Error('The requested relationship already exists');
      conflict.statusCode = 409;
      return conflict;
    }

    if (error.code === 'P2003') {
      const invalidRelation = new Error('The requested relationship is invalid');
      invalidRelation.statusCode = 422;
      return invalidRelation;
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    const invalidInput = new Error('The request contains invalid database fields');
    invalidInput.statusCode = 422;
    return invalidInput;
  }

  return error;
}

module.exports = { toApplicationError };

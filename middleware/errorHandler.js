import "dotenv/config";

const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message;

    if(err.name === 'SequelizeUniqueConstraintError'){
        statusCode = 400;
        message = err.errors[0].message;
    }

    if(err.name === 'SequelizeValidationError'){
        statusCode = 400;
        message = err.errors.map(e => e.message).join(', ');
    }

    console.error(`Error: ${err.stack}`);

    res.status(statusCode).json({
        status: "error",
        message: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

export default errorHandler;
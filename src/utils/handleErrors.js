

function handleHttpErrors(res, message = 'Something went wrong', codeError = 403) {  
    return res.status(codeError).json({ error: message });
}

module.exports = handleHttpErrors;
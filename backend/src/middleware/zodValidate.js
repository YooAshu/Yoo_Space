const zodValidate = (schema) => async (req, res, next) => {
    try {
        const parseBody = await schema.parseAsync(req.body)
        req.body = parseBody
        next()
    } catch (err) {
        const message = err.errors[0].message
        // console.log(message);

        res.status(400).json(
            {
                message: message
            }
        )
    }
}

export default zodValidate
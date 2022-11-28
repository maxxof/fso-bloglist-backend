const logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const requestLogger = (req, res, next) => {
    logger.info('Method:', req.method)
    logger.info('Path:  ', req.path)
    logger.info('Body:  ', req.body)
    logger.info('---')
    next()
}

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (err, req, res, next) => {
    logger.error(err.message)
  
    if (err.name === 'CastError') {
      return res.status(400).send({ error: 'malformatted id' })
    } else if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message })
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'invalid token' })
    }

    next(err)
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7)
  }
  next()
}

const userExtractor = async (req, res, next) => {

  const decodedToken = jwt.verify(req.token, process.env.SECRET)
  if (!req.token || !decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)
  req.user = user
  next()
}

module.exports = 
{ requestLogger, 
  unknownEndpoint, 
  errorHandler, 
  tokenExtractor, 
  userExtractor 
}
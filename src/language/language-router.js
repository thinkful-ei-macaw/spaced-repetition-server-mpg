const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')

const languageRouter = express.Router()
const jsonBodyParser = express.json()

languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )

      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        })

      req.language = language
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )

      res.json({
        language: req.language,
        words,
      })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/head', async (req, res, next) => {
    try {
      const word = await LanguageService.getLanguageHead(
        req.app.get('db'),
        req.language.id,
      )

      res.json({
        nextWord: word.original,
        wordCorrectCount: word.correct_count,
        wordIncorrectCount: word.incorrect_count,
        totalScore: word.total_score,
      })
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .post('/guess', jsonBodyParser, async (req, res, next) => {
    try {
      const { guess } = req.body

      if (!guess)
        return res.status(400).json({
          error: `Missing 'guess' in request body`
        })

      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )

      const ll = LanguageService.populateLinkedList(
        req.language,
        words,
      )

      const node = ll.head
      const answer = node.value.translation

      let isCorrect
      if (guess === answer) {
        isCorrect = true

        ll.head.value.memory_value = Number(node.value.memory_value) * 2

        ll.head.value.correct_count = Number(ll.head.value.correct_count) + 1

        ll.total_score = Number(ll.total_score) + 1
      } else {
        isCorrect = false

        ll.head.value.memory_value = 1

        ll.head.value.incorrect_count = Number(ll.head.value.incorrect_count) + 1
      }

      ll.shiftHeadBy(ll.head.value.memory_value)

      await LanguageService.updateLinkedList(
        req.app.get('db'),
        ll,
      )

      res.json({
        nextWord: ll.head.value.original,
        wordCorrectCount: ll.head.value.correct_count,
        wordIncorrectCount: ll.head.value.incorrect_count,
        totalScore: ll.total_score,
        answer,
        isCorrect,
      })
    } catch (error) {
      next(error)
    }
  })

module.exports = languageRouter























// const express = require('express')
// const LanguageService = require('./language-service')
// const { requireAuth } = require('../middleware/jwt-auth')

// const languageRouter = express.Router();
// const jsonBodyParser = express.json();

// languageRouter
//   .use(requireAuth)
//   .use(async (req, res, next) => {
//     try {
//       const language = await LanguageService.getUsersLanguage(
//         req.app.get('db'),
//         req.user.id,
//       )

//       if (!language)
//         return res.status(404).json({
//           error: `You don't have any languages`,
//         })

//       req.language = language
//       next()
//     } catch (error) {
//       next(error)
//     }
//   })

// languageRouter
//   .get('/', async (req, res, next) => {
//     try {
//       const words = await LanguageService.getLanguageWords(
//         req.app.get('db'),
//         req.language.id,
//       )

//       res.json({
//         language: req.language,
//         words,
//       })
//       next()
//     } catch (error) {
//       next(error)
//     }
//   })

// languageRouter
//   .get('/head', async (req, res, next) => {
//     try {
//       const wordList = await LanguageService.getWordList(
//         req.app.get('db'),
//         req.language.id,
//       )
//       console.log(JSON.stringify(wordList))
//       res.json({
//         nextWord: wordList.head.value.original,
//         correctCount: wordList.head.value.correct_count,
//         incorrectCount: wordList.head.value.incorrect_count,
//         totalScore: wordList.head.value.total_score
//       })
//     }
//     catch (error) {
//       next(error)
//     }
//   })

// languageRouter
//   .post('/guess', jsonBodyParser, async (req, res, next) => {
//     try {
//       const { guess } = req.body
//       if (!guess) {
//         return res.status(400).json({
//           error: 'Missing response in request body'
//         })
//       }
//       const words = await LanguageService.getWordList(
//         req.app.get('db'),
//         req.language.id
//       )


//       const node = words.head
//       const answer = node.value.translation

//       let correct
//       if (guess === answer) {
//         correct = true

//         words.head.value.memory = Number(node.value.memory_value) * 2

//         words.head.value.correct_count = Number(words.head.value.correct_count) + 1

//         words.total_score = Number(words.total_score) + 1

//       } else {
//         incorrect = false

//         words.head.value.memory_value = 1

//         words.head.value.incorrect_count = Number(words.head.value.incorrect_count) + 1

//       }

//       words.shiftHead(words.head.value.memory_value)

//       await LanguageService.moveLinkedList(
//         req.app.get('db'),
//         words
//       )

//       res.json({
//         nextWord: words.head.value.original,
//         correctCount: words.head.value.correct_count,
//         incorrectCount: words.head.value.incorrect_count,
//         totalScore: words.total_score,
//         answer,
//         correct
//       })


//     } catch (error) {
//       next(error)
//     }
//   })

// module.exports = languageRouter

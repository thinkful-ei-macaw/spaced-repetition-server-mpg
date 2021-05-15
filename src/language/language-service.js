const { LinkedList } = require('./linked-list')

const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('languages')
      .select(
        'languages.id',
        'languages.name',
        'languages.user_id',
        'languages.head',
        'languages.total_score',
      )
      .where('languages.user_id', user_id)
      .first()
  },

  getLanguageById(db, language_id) {
    return db
      .from('languages')
      .select(
        'languages.id',
        'languages.name',
        'languages.user_id',
        'languages.head',
        'languages.total_score',
      )
      .where('languages.id', language_id)
      .first()
  },

  getLanguageHead(db, language_id) {
    return db
      .from('words')
      .select(
        'words.id',
        'words.language_id',
        'words.original',
        'words.translation',
        'words.next',
        'words.memory_value',
        'words.correct_count',
        'words.incorrect_count',
        'languages.total_score',
      )
      .leftJoin('languages', 'languages.head', 'words.id')
      .where('languages.id', language_id)
      .first()
  },

  getLanguageWords(db, language_id) {
    return db
      .from('words')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count',
      )
      .where({ language_id })
  },

  populateLinkedList(language, words) {
    const ll = new LinkedList({
      id: language.id,
      name: language.name,
      total_score: language.total_score,
    })

    let word = words.find(w => w.id === language.head)

    ll.insert({
      id: word.id,
      original: word.original,
      translation: word.translation,
      memory_value: word.memory_value,
      correct_count: word.correct_count,
      incorrect_count: word.incorrect_count,
    })

    while (word.next) {
      word = words.find(w => w.id === word.next)

      ll.insert({
        id: word.id,
        original: word.original,
        translation: word.translation,
        memory_value: word.memory_value,
        correct_count: word.correct_count,
        incorrect_count: word.incorrect_count,
      })
    }

    return ll
  },

  updateLinkedList(db, linkedLanguage) {
    return db.transaction(trx =>
      Promise.all([
        db('languages')
          .transacting(trx)
          .where('id', linkedLanguage.id)
          .update({
            total_score: linkedLanguage.total_score,
            head: linkedLanguage.head.value.id,
          }),
        ...linkedLanguage.map(node =>
          db('words')
            .transacting(trx)
            .where('id', node.value.id)
            .update({
              memory_value: node.value.memory_value,
              correct_count: node.value.correct_count,
              incorrect_count: node.value.incorrect_count,
              next: node.next ? node.next.value.id : null,
            })
        )
      ])
    )
  }
}

module.exports = LanguageService

























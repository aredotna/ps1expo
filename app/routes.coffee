module.exports = (match) ->
  match '', 'home#index'
  match ':id', 'home#show'

exports.by_to = {
  map: function(doc) {
    if (doc.to) {
      emit(doc.to, {_id: doc._id});
    }
  }
};

exports.by_to_createdAt = {
  map: function(doc) {
    if (doc.to && doc.createdAt) {
      emit([doc.to, doc.createdAt], {_id: doc._id});
    }
  }
};

exports.to_count = {
  map: function(doc) {
    if (doc.to) {
      emit(doc.to, 1);
    }
  },
  reduce: function(keys, values) {
    return sum(values);
  }
}
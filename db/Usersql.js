var userSQL = {
	insertUser: 'insert into users(uid, name, telephone, password) values(?,?,?,?)',  // 添加用户
	findUserByPhone: 'select * from users where telephone = ?',     //查找用户是否存在
	findUserByName: 'select * from users where name = ?',
	searchSinger: 'select * from singer where singerName = ?',
	searchSong: 'select * from music where singerId = ?',
	singer: 'select * from singer where countryType = ? and singerGender = ?',
	findSong: 'select * from music where musicName = ?',
	getComment: 'select * from comment where songId = ?',
	addComment: 'insert into comment(songId, comment) values(?, ?)',
	findSinger: 'select * from music where singerId = (select singerId from singer where singerName = ?)'
};

module.exports = userSQL;

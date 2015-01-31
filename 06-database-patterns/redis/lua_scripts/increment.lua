local key = KEYS[1]

local value = redis.call('get', key) or 0
local newValue = value + 1
redis.call('set', key, newValue)

return newValue
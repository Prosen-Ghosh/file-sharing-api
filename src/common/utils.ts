import { createHmac } from "crypto"

export const getHash = (secreet, algo = 'sha256') => {
    return createHmac(algo, secreet).digest('hex')
}
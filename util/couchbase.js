const couchbase = require('couchbase');

const COUCHBASE_USER = process.env.COUCHBASE_USER
const COUCHBASE_PASSWORD = process.env.COUCHBASE_PASSWORD
const COUCHBASE_ENDPOINT = process.env.COUCHBASE_ENDPOINT
let COUCHBASE_BUCKET = process.env.COUCHBASE_BUCKET
let IS_CLOUD_INSTANCE = process.env.IS_CLOUD_INSTANCE
if (!COUCHBASE_USER) {
  throw new Error(
    'Please define the COUCHBASE_USER environment variable inside .env.local'
  )
}

if (!COUCHBASE_PASSWORD) {
  throw new Error(
    'Please define the COUCHBASE_PASSWORD environment variable inside .env.local'
  )
}

if (!COUCHBASE_BUCKET) {
  COUCHBASE_BUCKET = 'travel-sample'
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.couchbase

if (!cached) {
  cached = global.couchbase = { conn: null }
}

async function createCouchbaseCluster() {
  if (cached.conn) {
    return cached.conn
  }

  cached.conn = new couchbase.Cluster('couchbase://'+ COUCHBASE_ENDPOINT + (IS_CLOUD_INSTANCE === 'true' ? '?ssl=no_verify&console_log_level=5' : ''), { // ?ssl=no_verify&console_log_level=5
    username: COUCHBASE_USER,
    password: COUCHBASE_PASSWORD
  })

  return cached.conn
}

export async function connectToDatabase() {
  const cluster = await createCouchbaseCluster()
  const bucket = cluster.bucket(COUCHBASE_BUCKET);
  await ensureIndexes(cluster)
  const collection = bucket.collection('profile');

  let dbConnection = {
    cluster,
    bucket,
    profileCollection: collection
  }

  return dbConnection;
}

const ensureIndexes = async(cluster) => {
  try {
    const bucketIndex = `CREATE PRIMARY INDEX ON ${COUCHBASE_BUCKET}`
    const collectionIndex = `CREATE PRIMARY INDEX ON default:${COUCHBASE_BUCKET}._default.profile;`
    await cluster.query(bucketIndex)
    await cluster.query(collectionIndex)
    console.log(`Index Creation: SUCCESS`)
  } catch (err) {
    console.info(err);
    // if (err instanceof couchbase.IndexExistsError) {
    //   console.info('Index Creation: Indexes Already Exists')
    // } else {
    //   console.log("insure index error, but prob ok");
    //   // console.error(err)
    // }
  }
}

const AwakeVideo = artifacts.require('./AwakeVideo.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('AwakeVideo', ([deployer, author]) => {
  let awakevideo;

  before(async () => {
    awakevideo = await AwakeVideo.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await awakevideo.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await awakevideo.name()
      assert.equal(name, 'AwakeVideo')
    })
  })

  describe('videos', async () => {
    let result, videoCount

    before(async () => {
      result = await awakevideo.uploadVideo('Video title', { from: author })
      videoCount = await awakevideo.videoCount()
    })

    //check event
    it('creates videos', async () => {
      // SUCESS
      assert.equal(videoCount, 1)
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), videoCount.toNumber(), 'id is correct')
      assert.equal(event.title, 'Video title', 'title is correct')
      assert.equal(event.author, author, 'author is correct')

      // FAILURE: Video must have title
      await awakevideo.uploadVideo('', { from: author }).should.be.rejected;
    })

    //check from Struct
    it('lists videos', async () => {
      const video = await awakevideo.videos(videoCount)
      assert.equal(video.id.toNumber(), videoCount.toNumber(), 'id is correct')
      assert.equal(video.title, 'Video title', 'title is correct')
      assert.equal(video.author, author, 'author is correct')
    })
  })
})
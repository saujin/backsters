export default function(express) {

  express.response.sendStepResult = function(result) {
    return result.processed
      ? this.status(200).json({success: true})
      : this.status(200).json({success: false, validationErrors: result.validationErrors})
  }

  express.response.sendValidationErrors = function (validationErrors) {
    this.status(200).json({ success: false, validationErrors })
  }
}
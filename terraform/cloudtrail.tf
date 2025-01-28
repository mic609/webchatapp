# resource "aws_s3_bucket" "cloudtrail_bucket" {
#   bucket = "cloudtrail-bucket"
# }

# resource "aws_s3_bucket_policy" "cloudtrail_bucket_policy" {
#   bucket = aws_s3_bucket.cloudtrail_bucket.id

#   policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [
#       {
#         Sid       = "AWSCloudTrailAclCheck"
#         Effect    = "Allow"
#         Principal = {
#           Service = "cloudtrail.amazonaws.com"
#         }
#         Action    = "s3:GetBucketAcl"
#         Resource  = "arn:aws:s3:::${aws_s3_bucket.cloudtrail_bucket.id}"
#       },
#       {
#         Sid       = "AWSCloudTrailWrite"
#         Effect    = "Allow"
#         Principal = {
#           Service = "cloudtrail.amazonaws.com"
#         }
#         Action    = "s3:PutObject"
#         Resource  = "arn:aws:s3:::${aws_s3_bucket.cloudtrail_bucket.id}/AWSLogs/${data.aws_caller_identity.current.account_id}/*"
#         Condition = {
#           StringEquals = {
#             "s3:x-amz-acl" = "bucket-owner-full-control"
#           }
#         }
#       }
#     ]
#   })
# }

# resource "aws_cloudtrail" "example" {
#   name                          = "aws-trail"
#   s3_bucket_name                = aws_s3_bucket.cloudtrail_bucket.bucket
#   include_global_service_events = true
#   is_multi_region_trail         = true
#   enable_logging                = true
# }
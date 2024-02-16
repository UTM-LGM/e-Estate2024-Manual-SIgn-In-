﻿using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using E_EstateV2_API.ViewModel;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Mvc;
using MimeKit;
using MimeKit.Text;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class EmailsController : ControllerBase
    {
        private readonly IEmailRepository _emailRepository;
        public EmailsController(IEmailRepository emailRepository)
        {
            _emailRepository = emailRepository;
        }

        [HttpPost]
        public async Task<IActionResult> SendEmailCountry(Email request)
        {
            try
            {
                await _emailRepository.SendEmail(request);
                return Ok(new { message = "Email successfully send, Changes will be make within 24 hour" });
            }
            catch (Exception ex)
            {
                return BadRequest("Failed to send email: " + ex.Message);
            }
        }


        [HttpPost]
        public async Task<IActionResult> SendEmailVerification(Email request)
        {
            try
            {
                await _emailRepository.SendEmail(request);
                return Ok(new { message = "Registration success ! Please check email for verification." });
            }
            catch (Exception ex)
            {
                return BadRequest("Failed to send email: " + ex.Message);
            }
        }



        [HttpGet]
        [Route("{encodedData}")]
        public async Task<IActionResult> VerifyEmail([FromRoute] string encodedData)
        {
            await _emailRepository.VerifyEmailVerifiedUser(encodedData);
            await _emailRepository.VerifyEmail(encodedData);
            return Redirect("https://lgm20.lgm.gov.my/e-Estate/verifyemail");
        }

        [HttpPost]
        public async Task<IActionResult> SendResetPasswordEmail([FromBody] User user)
        {
            try
            {
                await _emailRepository.SendPasswordResetEmail(user);
                return Ok(new { message = "Reset password link successfully sent to email !" });
            }
            catch (Exception ex)
            {
                return BadRequest("Failed to send to inccorect email");
            }
        }

        [HttpPost]
        public async Task<IActionResult> ResetPassword([FromBody] DTO_User user)
        {
            try
            {
                var result = await _emailRepository.ResetPassword(user);

                if (result.Succeeded)
                {
                    return Ok(new { message = "Password reset successful !" });
                }
                else
                {
                    // Check for the specific error indicating an invalid or expired token
                    if (result.Errors.Any(error => error.Description == "Failed"))
                    {
                        return BadRequest(new { message = "Invalid or expired token. Please request a new password reset." });
                    }
                    else
                    {
                        // Handle other errors as needed
                        return BadRequest(new { message = "Failed to reset password." });
                    }
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Failed to reset password." });
            }
        }
    }
}

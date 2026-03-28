import { SendInviteDto } from "#/modules/auth/dtos/send-invite.dto";

export function GetInviteHtml(dto: SendInviteDto, inviteLink: string) {
    return `
      <h2>You have been invited!</h2>
      <p>You have been invited to join the platform as a <strong>${dto.role}</strong>.</p>
      <p>Please click the link below to accept the invitation and set up your account. This link will expire in 7 days.</p>
      <a href="${inviteLink}">Accept Invitation</a>
    `
}
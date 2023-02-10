---
layout: page
---

<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamMembers
} from 'vitepress/theme'

const members = [
  {
    avatar: 'https://hector.im/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F893b7300-9791-4630-94be-1d4268212d40%2Favatar.png?table=block&id=a2975629-05b3-4455-9eea-32cd4c716f03&spaceId=4b4aefae-2111-47f3-a66f-24663de13046&width=250&userId=&cache=v2',
    name: 'Héctor Chong',
    title: 'Creator',
    links: [
      { icon: 'github', link: 'https://github.com/Hector-Chong' },
      { icon: 'instagram', link: 'https://hector.im' },
    ]
  }
]
</script>

<VPTeamPage>
<VPTeamMembers
    :members="members"
  />
</VPTeamPage>

<template>
    <div class="page-bg p-4">
        <router-link to="/admin/teams" class="btn btn-outline-dark mb-3 d-flex align-items-center gap-2 w-fit">
            <ArrowLeft size="16" />
            Back to Teams
        </router-link>

        <!-- Team Card -->
        <div class="team-card card p-4 mb-4" v-if="team">
            <div class="d-flex align-items-start justify-content-between mb-3">
                <div>
                    <div class="ws-pill d-inline-flex align-items-center gap-1 mb-2">
                        <Layers :size="12" />
                        {{ team?.workspace?.workspace_name || "Workspace" }}
                    </div>

                    <h5 class="team-title mb-1">{{ team.title }}</h5>

                    <p class="team-desc mb-0">{{ team.description || "No description" }}</p>
                </div>
            </div>

            <hr />

            <!-- Stats -->
            <div class="row g-2 mb-3">
                <div class="col-6">
                    <div class="stat-box d-flex align-items-center gap-2 rounded-3 p-3">
                        <div class="stat-icon stat-purple rounded-3 d-flex align-items-center justify-content-center">
                            <Users size="16" />
                        </div>
                        <div>
                            <div class="stat-label">Total members</div>
                            <div class="stat-val">{{ team?.members?.length ?? 0 }}</div>
                        </div>
                    </div>
                </div>

                <div class="col-6">
                    <div class="stat-box d-flex align-items-center gap-2 rounded-3 p-3">
                        <div class="stat-icon stat-blue rounded-3 d-flex align-items-center justify-content-center">
                            <Building2 size="16" />
                        </div>
                        <div>
                            <div class="stat-label">Workspace</div>
                            <div class="stat-val text-truncate">{{ team?.workspace?.workspace_name || "N/A" }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Members -->
        <div class="section-label mb-2">Members · {{ team?.members?.length ?? 0 }}</div>

        <div class="d-flex flex-column gap-2">
            <div
                class="member-row d-flex align-items-center justify-content-between rounded-3 px-3 py-2"
                v-for="member in team?.members"
                :key="member.user_id"
            >
                <div class="d-flex align-items-center gap-2">
                    <!-- Bootstrap avatar with fallback -->
                    <img
                        :src="member.avatar"
                        :alt="member.name"
                        class="member-avatar rounded-circle"
                        @error="e => e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name || 'User')}&background=random&size=64`"
                    />

                    <div>
                        <div class="member-name">{{ member.name }}</div>
                        <div class="member-id">user #{{ member.user_id }}</div>
                    </div>
                </div>

                <div class="d-flex align-items-center gap-2">
                    <span class="role-badge" :class="member.role === 'owner' ? 'role-owner' : 'role-member'">
                        {{ member.role }}
                    </span>

                    <button class="btn btn-sm btn-light border">
                        <MoreVertical size="13" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useTeamstore } from "@/stores/admin/teams";
import {
    ArrowLeft,
    Layers,
    Users,
    Building2,
    MoreVertical,
} from "lucide-vue-next";

const route = useRoute();
const useTeam = useTeamstore();
const team_id = Number(route.params.id);

const team = computed(() => useTeam.currentTeam);

onMounted(async () => {
    await useTeam.teamId(team_id);
});
</script>

<style scoped>
.page-bg {
    background: #f4f6f9;
    min-height: 85vh;
}

.w-fit {
    width: fit-content;
}

.team-card {
    border-left: 3px solid #378add !important;
    border-radius: 0 14px 14px 0 !important;
    border: 0.5px solid #e8e8e8;
}

.ws-pill {
    background: #e6f1fb;
    color: #0c447c;
    font-size: 11px;
    padding: 3px 10px;
    border-radius: 20px;
}

.team-title {
    font-size: 18px;
    font-weight: 500;
}

.team-desc {
    font-size: 13px;
    color: #94a3b8;
}

.stat-box {
    background: #f8fafc;
}

.stat-icon {
    width: 34px;
    height: 34px;
    flex-shrink: 0;
}

.stat-purple {
    background: #cecbf6;
    color: #3c3489;
}

.stat-blue {
    background: #e6f1fb;
    color: #0c447c;
}

.stat-label {
    font-size: 11px;
    color: #94a3b8;
}

.stat-val {
    font-size: 14px;
    font-weight: 500;
}

.section-label {
    font-size: 11px;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.member-row {
    background: white;
    border: 0.5px solid #e8e8e8;
}

/* Avatar — replaces n-avatar */
.member-avatar {
    width: 34px;
    height: 34px;
    object-fit: cover;
    flex-shrink: 0;
}

.member-name {
    font-size: 13px;
    font-weight: 500;
}

.member-id {
    font-size: 11px;
    color: #94a3b8;
}

.role-badge {
    font-size: 11px;
    padding: 3px 10px;
    border-radius: 20px;
}

.role-owner {
    background: #faeeda;
    color: #633806;
}

.role-member {
    background: #e6f1fb;
    color: #0c447c;
}
</style>
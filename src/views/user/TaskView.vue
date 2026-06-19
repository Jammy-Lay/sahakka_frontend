<template>
  <div class="">
    <!-- Header -->
    <div class="position-sticky top-0 z-1 header pt-4 pb-2 bg-body">
      <div class="d-flex align-items-start justify-content-between mb-3">
        <TitleTeamSkeleton v-if="teamStore.loading" />
        <div v-else>
          <h2 class="fw-semibold fs-5 mb-1">{{ getTeamById.title }}</h2>
          <p class="text-secondary fs-13 mb-0">{{ getTeamById.description }}</p>
        </div>
        <div class="d-flex gap-2">
          <button
            class="btn btn-white bg-white rounded-btn border-1 border-white fs-13 d-flex align-items-center gap-1"
          >
            <Filter size="16" /> Filter
          </button>
          <BaseButton
            class="fs-13 py-1 px-3 rounded-btn"
            btn-name="New Task"
            icon="plus"
            @click="showCreateTask = true"
          />
        </div>
      </div>

      <!-- Create Task Modal -->
      <n-modal v-model:show="showCreateTask" :mask-closable="true">
        <div class="bg-white rounded-card" style="width: 750px">
          <div class="d-flex align-items-center justify-content-between px-4 py-3 pb-2">
            <span class="fw-medium fs-5">Create task</span>
            <n-button
              text
              size="small"
              @click="showCreateTask = false"
              class="hover-circle p-1 rounded-circle"
            >
              <X size="18" />
            </n-button>
          </div>

          <n-divider style="margin: 5px 0; --n-color: #e4e4e7" />

          <div class="px-4 pt-2 pb-4">
            <label class="mb-2 fs-13 text-dark mt-2">Title</label>
            <BaseInput
              v-model="form.title"
              input-placeholder="Title"
              input-class="py-2 fs-13 rounded-btn-sm bg-white mb-3"
            />
            <label class="mb-2 fs-13 text-dark">Description</label>
            <textarea
              v-model="form.description"
              placeholder="Description"
              class="form-control fs-13 rounded-btn-sm bg-white mb-3 base-input"
              style="min-height: 120px; resize: vertical; border: 1px solid #e4e4e7"
            />

            <div class="d-flex align-items-center gap-3 mb-3">
              <span class="fs-13 fw-medium">Type of task</span>
              <n-popover
                trigger="click"
                placement="bottom-start"
                v-model:show="showTypePop"
                :show-arrow="false"
                style="border-radius: 12px; padding: 6px; width: 160px"
              >
                <template #trigger>
                  <span
                    class="tab-info cursor-pointer"
                    :class="[typeConfig[form.type]?.bg, typeConfig[form.type]?.text]"
                  >
                    <Circle size="10" :fill="typeConfig[form.type]?.fill" />
                    {{ form.type }}
                  </span>
                </template>
                <div>
                  <div
                    v-for="(cfg, key) in typeConfig"
                    :key="key"
                    class="d-flex align-items-center gap-2 px-2 py-1 rounded workspace-item fs-13 fw-medium cursor-pointer text-capitalize"
                    @click="
                      form.type = key;
                      showTypePop = false;
                    "
                  >
                    <Circle size="10" :fill="cfg.fill" stroke-width="0" />
                    {{ key }}
                  </div>
                </div>
              </n-popover>
            </div>

            <div class="meta-grid-modal">
              <span class="fs-13 text-mute d-flex align-items-center gap-1">
                <circle-dashed size="14" /> Status
              </span>
              <span class="fs-13 text-mute d-flex align-items-center gap-1">
                <ghost size="14" /> Priority
              </span>
              <span class="fs-13 text-mute d-flex align-items-center gap-1">
                <users size="14" /> Assignee
              </span>
              <span
                class="fs-13 text-mute d-flex align-items-center gap-1"
                style="grid-column: span 2"
              >
                <calendar size="14" /> Date range
              </span>

              <!-- Status -->
              <n-popover
                trigger="click"
                placement="bottom-start"
                v-model:show="showStatusPop"
                :show-arrow="false"
                style="border-radius: 12px; padding: 6px; width: 160px"
              >
                <template #trigger>
                  <span
                    class="tab-info w-fit fw-medium cursor-pointer"
                    :class="[
                      statusConfig[form.status]?.bg,
                      statusConfig[form.status]?.text,
                    ]"
                  >
                    <component :is="statusConfig[form.status]?.icon" size="14" />
                    {{ statusConfig[form.status]?.label }}
                  </span>
                </template>
                <div>
                  <div
                    v-for="(cfg, key) in statusConfig"
                    :key="key"
                    class="d-flex align-items-center gap-2 px-2 py-1 rounded workspace-item fs-13 fw-medium cursor-pointer"
                    @click="
                      form.status = key;
                      showStatusPop = false;
                    "
                  >
                    <component :is="cfg.icon" size="14" />
                    {{ cfg.label }}
                  </div>
                </div>
              </n-popover>

              <!-- Priority -->
              <n-popover
                trigger="click"
                placement="bottom-start"
                v-model:show="showPriorityPop"
                :show-arrow="false"
                style="border-radius: 12px; padding: 6px; width: 140px"
              >
                <template #trigger>
                  <span
                    class="tab-info w-fit fw-medium cursor-pointer"
                    :class="[
                      priorityConfig[form.priority]?.bg,
                      priorityConfig[form.priority]?.text,
                    ]"
                  >
                    <Circle
                      size="10"
                      :fill="priorityConfig[form.priority]?.fill"
                      stroke-width="0"
                    />
                    {{ form.priority }}
                  </span>
                </template>
                <div>
                  <div
                    v-for="(cfg, key) in priorityConfig"
                    :key="key"
                    class="d-flex align-items-center gap-2 px-2 py-1 rounded workspace-item fs-13 fw-medium cursor-pointer text-capitalize"
                    @click="
                      form.priority = key;
                      showPriorityPop = false;
                    "
                  >
                    <Circle size="10" :fill="cfg.fill" stroke-width="0" />
                    {{ key }}
                  </div>
                </div>
              </n-popover>

              <!-- Assignee -->
              <n-popover
                trigger="click"
                placement="bottom-start"
                v-model:show="showAssigneePop"
                :disabled="!canChangeAssignee"
                :show-arrow="false"
                style="border-radius: 12px; padding: 6px; width: fit-content"
              >
                <template #trigger>
                  <span
                    class="d-flex align-items-center gap-2 fs-13"
                    :class="canChangeAssignee ? 'cursor-pointer' : 'cursor-default'"
                  >
                    <img
                      v-if="form.assigned_to"
                      :src="
                        getTeamById.members?.find((m) => m.user_id === form.assigned_to)
                          ?.avatar
                      "
                      class="rounded-circle object-fit-cover"
                      style="width: 22px; height: 22px"
                    />
                    <div
                      v-else
                      class="rounded-circle bg-secondary d-flex align-items-center justify-content-center"
                      style="width: 22px; height: 22px; flex-shrink: 0"
                    >
                      <img
                        src="../../assets/image/default-avatar.png"
                        alt=""
                        class="w-100 h-100 object-fit-cover rounded-circle"
                      />
                    </div>
                    <n-ellipsis style="max-width: 80px">
                      {{
                        form.assigned_to
                          ? getTeamById.members?.find(
                              (m) => m.user_id === form.assigned_to
                            )?.name
                          : "No Assignee"
                      }}
                    </n-ellipsis>
                    <span
                      v-if="form.assigned_to === getMe.user_id"
                      class="text-mute fs-11"
                      >(You)</span
                    >
                  </span>
                </template>

                <div>
                  <div
                    v-if="canChangeAssignee"
                    class="d-flex align-items-center gap-2 px-2 py-1 rounded workspace-item fs-13 cursor-pointer"
                    @click="
                      form.assigned_to = null;
                      showAssigneePop = false;
                    "
                  >
                    <div
                      class="rounded-circle bg-secondary d-flex align-items-center justify-content-center"
                      style="width: 22px; height: 22px; flex-shrink: 0"
                    >
                      <img
                        src="../../assets/image/default-avatar.png"
                        alt=""
                        class="w-100 h-100 object-fit-cover rounded-circle"
                      />
                    </div>
                    <span class="text-mute">No Assignee</span>
                  </div>

                  <div
                    v-for="member in getAssigneeOptions"
                    :key="member.user_id"
                    class="d-flex align-items-center gap-2 px-2 py-1 rounded workspace-item fs-13 cursor-pointer"
                    @click="
                      form.assigned_to = member.user_id;
                      showAssigneePop = false;
                    "
                  >
                    <img
                      :src="member.avatar"
                      class="rounded-circle object-fit-cover"
                      style="width: 22px; height: 22px"
                    />
                    <n-ellipsis
                      style="max-width: 80px"
                      :tooltip="{
                        keepAliveOnHover: false,
                        style: { pointerEvents: 'none' },
                      }"
                    >
                      {{ member.name }}
                    </n-ellipsis>
                    <span v-if="member.user_id === getMe.user_id" class="text-mute fs-11">
                      (You)
                    </span>
                    <template v-else>
                      <span v-if="member.role === 'moderator'" class="text-mute fs-11"
                        >(Moderator)</span
                      >
                    </template>
                  </div>
                </div>
              </n-popover>

              <n-date-picker
                v-model:value="form.date_range"
                type="daterange"
                clearable
                :to="false"
                class="custom-picker"
              />
            </div>
          </div>

          <div class="d-flex justify-content-end gap-3 px-4 py-3">
            <button
              class="btn btn-outline-light border-0 text-dark rounded-btn fs-14 fw-bold px-4"
              @click="showCreateTask = false"
            >
              Close
            </button>
            <button
              class="btn bg-btn w-fit rounded-btn py-2 px-3 fs-14"
              :disabled="isLoading"
              @click="handleCreateTask"
            >
              <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" />
              {{ isLoading ? "Creating" : "Create Task" }}
            </button>
          </div>
        </div>
      </n-modal>

      <!-- Task Detail Modal -->
      <n-modal v-model:show="showTaskModal" :mask-closable="true">
        <div
          v-if="selectedTask"
          class="bg-white task-detail-modal"
          :class="{ 'modal-expanded': showActivity }"
        >
          <!-- Modal Top Bar -->
          <div class="detail-topbar">
            <span class="fw-medium fs-5">Detail</span>
            <div class="d-flex align-items-center gap-2">
              <button
                class="icon-action-btn"
                @click="showActivity = !showActivity"
                :title="showActivity ? 'Collapse' : 'Show activity'"
              >
                <Expand v-if="!showActivity" size="16" />
                <Shrink v-else size="16" />
              </button>
              <button class="icon-action-btn" @click="showTaskModal = false">
                <X size="18" />
              </button>
            </div>
          </div>

          <!-- Modal Body -->
          <div class="detail-body">
            <!-- Left / Main Panel -->
            <div class="detail-main" :class="{ 'with-activity': showActivity }">
              <div class="detail-scroll">
                <!-- Assignee row -->
                <div class="d-flex align-items-center justify-content-between mb-3">
                  <div class="d-flex align-items-center gap-2">
                    <template v-if="!selectedTask.assigned_to?.user_id">
                      <img
                        src="../../assets/image/default-avatar.png"
                        class="rounded-circle object-fit-cover"
                        style="width: 30px; height: 30px"
                      />
                      <span class="fw-medium text-mute fs-13">No assignee</span>
                    </template>
                    <template
                      v-else-if="
                        selectedTask.created_by?.user_id ===
                        selectedTask.assigned_to?.user_id
                      "
                    >
                      <img
                        :src="selectedTask.created_by?.avatar"
                        class="rounded-circle object-fit-cover"
                        style="width: 30px; height: 30px"
                      />
                      <span class="fw-semibold fs-13">{{
                        selectedTask.created_by?.name
                      }}</span>
                      <span class="fw-bold text-mute fs-12">·</span>
                      <span class="text-mute fs-13">Self-assigned the task</span>
                    </template>
                    <template v-else>
                      <img
                        :src="selectedTask.assigned_by?.avatar"
                        class="rounded-circle object-fit-cover"
                        style="width: 30px; height: 30px"
                      />
                      <span class="fw-semibold fs-13">{{
                        selectedTask.assigned_by?.name
                      }}</span>
                      <span class="fw-bold text-mute fs-12">·</span>
                      <span
                        v-if="selectedTask.assigned_to?.user_id === getMe.user_id"
                        class="text-mute fs-13"
                        >Assigned to you</span
                      >
                      <span v-else class="text-mute fs-13"
                        >Assigned to {{ selectedTask.assigned_to?.name }}</span
                      >
                    </template>
                  </div>

                  <!-- Type badge -->
                  <n-popover
                    trigger="click"
                    placement="bottom-end"
                    v-model:show="showDetailTypePop"
                    :show-arrow="false"
                    style="border-radius: 12px; padding: 6px; width: 160px"
                  >
                    <template #trigger>
                      <span
                        class="tab-info fw-medium cursor-pointer"
                        :class="[
                          typeConfig[selectedTask.type]?.bg,
                          typeConfig[selectedTask.type]?.text,
                        ]"
                        @click.stop
                      >
                        <Circle
                          size="10"
                          :fill="typeConfig[selectedTask.type]?.fill"
                          stroke-width="0"
                        />
                        {{ selectedTask.type }}
                      </span>
                    </template>
                    <div>
                      <div
                        v-for="(cfg, key) in typeConfig"
                        :key="key"
                        class="d-flex align-items-center gap-2 px-2 py-1 rounded workspace-item fs-13 fw-medium cursor-pointer text-capitalize"
                        @click="
                          selectedTask.type = key;
                          showDetailTypePop = false;
                          handleUpdateTask(selectedTask, true);
                        "
                      >
                        <Circle size="10" :fill="cfg.fill" stroke-width="0" />
                        {{ key }}
                      </div>
                    </div>
                  </n-popover>
                </div>

                <!-- Meta rows -->
                <div class="detail-meta-rows mb-3">
                  <div class="detail-meta-row">
                    <span class="detail-meta-label"
                      ><CircleDashed size="14" /> Status</span
                    >
                    <n-popover
                      trigger="click"
                      placement="bottom-start"
                      v-model:show="showDetailStatusPop"
                      :show-arrow="false"
                      :disabled="isStatusLocked(selectedTask.status)"
                      style="border-radius: 12px; padding: 6px; width: 160px"
                    >
                      <template #trigger>
                        <span
                          class="tab-info w-fit fw-medium"
                          :class="[
                            statusConfigFull[selectedTask.status]?.bg,
                            statusConfigFull[selectedTask.status]?.text,
                            isStatusLocked(selectedTask.status)
                              ? 'cursor-default'
                              : 'cursor-pointer',
                          ]"
                          @click.stop
                        >
                          <component
                            :is="statusConfigFull[selectedTask.status]?.icon"
                            size="16"
                          />
                          {{ statusConfigFull[selectedTask.status]?.label }}
                        </span>
                      </template>
                      <div>
                        <div
                          v-for="(cfg, key) in statusConfig"
                          :key="key"
                          class="d-flex align-items-center gap-2 px-2 py-1 rounded workspace-item fs-13 fw-medium cursor-pointer"
                          @click="
                            selectedTask.status = key;
                            showDetailStatusPop = false;
                            handleUpdateTask(selectedTask, true);
                          "
                        >
                          <component :is="cfg.icon" size="14" />
                          {{ cfg.label }}
                        </div>
                      </div>
                    </n-popover>
                  </div>

                  <div class="detail-meta-row">
                    <span class="detail-meta-label"><Ghost size="14" /> Priority</span>
                    <n-popover
                      trigger="click"
                      placement="bottom-start"
                      v-model:show="showDetailPriorityPop"
                      :show-arrow="false"
                      style="border-radius: 12px; padding: 6px; width: 140px"
                    >
                      <template #trigger>
                        <span
                          class="tab-info w-fit fw-medium cursor-pointer"
                          :class="[
                            priorityConfig[selectedTask.priority]?.bg,
                            priorityConfig[selectedTask.priority]?.text,
                          ]"
                          @click.stop
                        >
                          <Circle
                            size="10"
                            :fill="priorityConfig[selectedTask.priority]?.fill"
                            stroke-width="0"
                          />
                          {{ selectedTask.priority }}
                        </span>
                      </template>
                      <div>
                        <div
                          v-for="(cfg, key) in priorityConfig"
                          :key="key"
                          class="d-flex align-items-center gap-2 px-2 py-1 rounded workspace-item fs-13 fw-medium cursor-pointer text-capitalize"
                          @click="
                            selectedTask.priority = key;
                            showDetailPriorityPop = false;
                            handleUpdateTask(selectedTask, true);
                          "
                        >
                          <Circle size="10" :fill="cfg.fill" stroke-width="0" />
                          {{ key }}
                        </div>
                      </div>
                    </n-popover>
                  </div>

                  <div class="detail-meta-row mt-1">
                    <span class="detail-meta-label"><Users size="14" /> Assignee</span>
                    <n-popover
                      trigger="click"
                      placement="bottom-start"
                      v-model:show="showDetailAssigneePop"
                      :disabled="!canChangeAssigneeOnUpdate(selectedTask)"
                      :show-arrow="false"
                      style="border-radius: 12px; padding: 6px; width: fit-content"
                    >
                      <template #trigger>
                        <span
                          class="d-flex align-items-center gap-2 fs-13"
                          :class="
                            canChangeAssigneeOnUpdate(selectedTask)
                              ? 'cursor-pointer'
                              : 'cursor-default'
                          "
                          @click.stop
                        >
                          <template v-if="!selectedTask.assigned_to?.user_id">
                            <img
                              src="../../assets/image/default-avatar.png"
                              class="rounded-circle object-fit-cover"
                              style="width: 22px; height: 22px"
                            />
                            <span class="text-mute">No assignee</span>
                          </template>
                          <template v-else>
                            <img
                              :src="selectedTask.assigned_to.avatar"
                              class="rounded-circle object-fit-cover"
                              style="width: 22px; height: 22px"
                            />
                            <p class="mb-0">
                              {{ selectedTask.assigned_to.name }}
                            </p>
                            <span
                              v-if="selectedTask.assigned_to.user_id === getMe.user_id"
                              class="text-secondary fs-11"
                              >(You)</span
                            >
                          </template>
                        </span>
                      </template>
                      <div>
                        <div
                          v-if="canChangeAssignee"
                          class="d-flex align-items-center gap-2 px-2 py-1 rounded workspace-item fs-13 cursor-pointer"
                          @click="
                            selectedTask.assigned_to = null;
                            showDetailAssigneePop = false;
                            handleUpdateTask(selectedTask, true);
                          "
                        >
                          <img
                            src="../../assets/image/default-avatar.png"
                            class="rounded-circle"
                            style="width: 22px; height: 22px"
                          />
                          <span class="text-mute">No Assignee</span>
                        </div>

                        <div
                          v-for="member in getAssigneeOptions"
                          :key="member.user_id"
                          class="d-flex align-items-center gap-2 px-2 py-1 rounded workspace-item fs-13 cursor-pointer"
                          @click="
                            selectedTask.assigned_to = member;
                            showDetailAssigneePop = false;
                            handleUpdateTask(selectedTask, true);
                          "
                        >
                          <img
                            :src="member.avatar"
                            class="rounded-circle object-fit-cover"
                            style="width: 22px; height: 22px"
                          />
                          <n-ellipsis
                            style="max-width: 80px"
                            :tooltip="{
                              keepAliveOnHover: false,
                              style: { pointerEvents: 'none' },
                            }"
                          >
                            {{ member.name }}
                          </n-ellipsis>
                          <span
                            v-if="member.user_id === getMe.user_id"
                            class="text-mute fs-11"
                            >(You)</span
                          >
                          <template v-else>
                            <span
                              v-if="member.role === 'moderator'"
                              class="text-mute fs-11"
                              >(Moderator)</span
                            >
                          </template>
                        </div>
                      </div>
                    </n-popover>
                  </div>

                  <div class="detail-meta-row mt-2">
                    <span class="detail-meta-label"
                      ><Calendar size="14" /> Start date</span
                    >
                    <n-popover
                      v-model:show="showDetailStartDatePop"
                      trigger="click"
                      placement="bottom-start"
                      :show-arrow="false"
                      style="border-radius: 12px; padding: 0; overflow: hidden"
                    >
                      <template #trigger>
                        <span
                          class="fs-13 cursor-pointer date-trigger"
                          :class="[
                            selectedTask.start_date ? 'text-dark' : 'text-mute',
                            showDetailStartDatePop ? 'bg-active' : '',
                          ]"
                          @click.stop
                        >
                          {{
                            selectedTask.start_date
                              ? formatDate(selectedTask.start_date)
                              : "Set date"
                          }}
                        </span>
                      </template>
                      <div class="custom-picker">
                        <n-date-picker
                          :value="dateToTs(selectedTask.start_date)"
                          type="date"
                          :to="false"
                          panel
                          @update:value="
                            (val) => {
                              selectedTask.start_date = formatToYMD(val);
                              showDetailStartDatePop = false;
                              handleUpdateTask(selectedTask, true);
                            }
                          "
                        />
                      </div>
                    </n-popover>
                  </div>

                  <div class="detail-meta-row mt-2">
                    <span class="detail-meta-label"><Calendar size="14" /> End Date</span>
                    <n-popover
                      v-model:show="showDetailEndDatePop"
                      trigger="click"
                      placement="bottom-start"
                      :show-arrow="false"
                      style="border-radius: 12px; padding: 0; overflow: hidden"
                    >
                      <template #trigger>
                        <span
                          class="fs-13 cursor-pointer date-trigger"
                          :class="[
                            selectedTask.end_date ? 'text-dark' : 'text-mute',
                            showDetailEndDatePop ? 'bg-active' : '',
                          ]"
                          @click.stop
                        >
                          {{
                            selectedTask.end_date
                              ? formatDate(selectedTask.end_date)
                              : "Set date"
                          }}
                        </span>
                      </template>
                      <div class="custom-picker">
                        <n-date-picker
                          :value="dateToTs(selectedTask.end_date)"
                          type="date"
                          :to="false"
                          panel
                          @update:value="
                            (val) => {
                              selectedTask.end_date = formatToYMD(val);
                              showDetailEndDatePop = false;
                              handleUpdateTask(selectedTask, true);
                            }
                          "
                        />
                      </div>
                    </n-popover>
                  </div>
                </div>

                <div class="d-flex flex-column">
                  <textarea
                    v-model="selectedTask.title"
                    class="detail-title-input fw-bold mb-2"
                    rows="1"
                    @blur="handleUpdateTask(selectedTask)"
                    @input="autoResize"
                  />
                  <textarea
                    v-model="selectedTask.description"
                    placeholder="No description provided"
                    class="detail-desc-input fs-13 text-mute mb-4"
                    rows="1"
                    @blur="handleUpdateTask(selectedTask)"
                    @input="autoResize"
                  />
                </div>

                <!-- File/Link Attachment -->
                <p class="fw-semibold fs-15 mb-2">
                  File attachment <Link size="15" class="ms-1" />
                </p>
                <input
                  ref="fileInputRef"
                  type="file"
                  accept="image/*,application/pdf"
                  class="d-none"
                  @change="handleFileChange"
                />
                <div class="attach-upload-box mb-4" @click="triggerFileInput">
                  <template v-if="!selectedFile">
                    <div class="attach-pdf-icon">
                      <FileText size="18" color="#e24b4a" />
                    </div>
                    <span class="fs-13 text-mute">Embed a PDF or Image</span>
                  </template>

                  <template v-else>
                    <!-- Image: show n-image thumbnail, click = built-in lightbox -->
                    <div
                      v-if="selectedFile.type.startsWith('image/')"
                      class="attach-thumb"
                      @click.stop
                    >
                      <n-image
                        :src="filePreviewUrl"
                        width="32"
                        height="32"
                        object-fit="cover"
                        style="border-radius: 6px; display: block"
                        show-toolbar-tooltip
                      />
                    </div>

                    <div
                      v-else
                      class="attach-pdf-icon cursor-pointer bg-blue"
                      @click.stop="openFilePreview"
                    >
                      <FileText size="18" color="#0088ff" />
                    </div>

                    <span class="fs-13 text-dark fw-medium flex-grow-1 text-truncate">
                      {{ selectedFile.name }}
                    </span>
                    <button
                      type="button"
                      class="icon-action-btn"
                      @click.stop="removeFile"
                    >
                      <X size="14" />
                    </button>
                  </template>
                </div>

                <!-- Messages -->
                <p class="fw-semibold fs-15 mb-2">
                  Messages <message-circle size="16" class="text-mute ms-1" />
                </p>
                <textarea
                  v-model="taskMessage"
                  placeholder="Send messages"
                  class="msg-textarea"
                />
              </div>
            </div>

            <!-- Right / Activity Panel -->
            <transition name="slide-activity">
              <div v-if="showActivity" class="detail-activity text-nowrap">
                <p
                  class="fw-semibold fs-14 position-sticky z-3 top-0 mb-0 pt-4 pb-3"
                  style="padding-left: 16px"
                >
                  Task activity
                </p>
                <div class="activity-scroll pt-0">
                  <template
                    v-if="selectedTask.activities && selectedTask.activities.length"
                  >
                    <template v-for="(group, gi) in groupedActivities" :key="gi">
                      <div class="activity-date-label">
                        <Calendar size="13" />
                        {{ group.date }}
                      </div>
                      <div
                        v-for="(act, ai) in group.items"
                        :key="ai"
                        class="activity-card"
                      >
                        <span class="act-tag" :class="actTagClass(act.action)">
                          <component :is="actTagIcon(act.action)" size="14" />
                          {{ act.action }}
                        </span>
                        <div
                          class="d-flex align-items-center justify-content-between mb-2"
                        >
                          <div class="d-flex align-items-center gap-2">
                            <img
                              :src="act.user.avatar"
                              class="rounded-circle object-fit-cover"
                              style="width: 24px; height: 24px"
                            />
                            <span class="fw-semibold fs-13">{{ act.user?.name }}</span>
                          </div>
                          <span class="fs-11 text-mute">{{ act.time }}</span>
                        </div>
                        <div class="act-note">{{ act.note }}</div>
                      </div>
                    </template>
                  </template>

                  <template v-else>
                    <div class="text-mute fs-13 text-center py-4">No activity yet</div>
                  </template>
                </div>
              </div>
            </transition>
          </div>

          <!-- Modal Bottom Bar -->
          <div class="detail-bottombar">
            <span class="fw-semibold fs-5">Submission</span>
            <button
              class="btn bg-btn rounded-4 py-2 px-3 d-flex align-items-center gap-2"
              :disabled="isLoading"
              @click="handleSubmit(selectedTask)"
            >
              <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" />
              <Send v-else :size="16" />
              {{ isLoading ? "Submitting..." : "Submit" }}
            </button>
          </div>
        </div>
      </n-modal>

      <!-- Status Tabs -->
      <div class="d-flex flex-wrap gap-2 mb-3">
        <span
          class="tab-title"
          :class="activeTab === '' ? 'tab-dark' : 'tab-default'"
          @click="handleTabClick('')"
          ><layout-dashboard size="16" /> All tasks</span
        >
        <span
          class="tab-title"
          :class="
            activeTab === 'todo' ? 'bg-blue-active text-white' : 'bg-blue text-blue'
          "
          @click="handleTabClick('todo')"
          ><circle-check-big size="16" /> To do</span
        >
        <span
          class="tab-title"
          :class="
            activeTab === 'in_progress'
              ? 'bg-orange-active text-white'
              : 'bg-orange text-orange'
          "
          @click="handleTabClick('in_progress')"
          ><circle-dashed size="16" /> In process</span
        >
        <span
          class="tab-title"
          :class="
            activeTab === 'submitted'
              ? 'bg-purple-active text-white'
              : 'bg-purple text-purple'
          "
          @click="handleTabClick('submitted')"
          ><Send size="16" /> Submitted</span
        >
        <span
          class="tab-title"
          :class="
            activeTab === 'approved'
              ? 'bg-green-active text-white'
              : 'bg-green text-green'
          "
          @click="handleTabClick('approved')"
          ><CircleCheck size="16" /> Approved</span
        >
        <span
          class="tab-title"
          :class="
            activeTab === 'rejected' ? 'bg-red-active text-white' : 'bg-red text-danger'
          "
          @click="handleTabClick('rejected')"
          ><CircleX size="16" /> Rejected</span
        >
      </div>
    </div>

    <TaskSkeleton v-if="taskStore.loading" />

    <template v-else>
      <n-empty
        v-if="getTask.length === 0"
        description="No Data"
        class="mt-8"
        style="--n-icon-size: 45px; font-size: 14px"
      />

      <!-- Task Cards -->
      <n-scrollbar style="max-height: 100%" v-else>
        <div class="task-grid text-nowrap">
          <div
            class="bg-white rounded-card border border-0 showTrash"
            style="padding: 20px; min-height: 220px; cursor: pointer"
            v-for="task in getTask"
            :key="task.id"
            @click="openTaskModal(task)"
          >
            <div class="d-flex align-items-center justify-content-between mb-3">
              <div class="d-flex align-items-center gap-2">
                <template v-if="!task.assigned_to?.user_id">
                  <img
                    src="../../assets/image/default-avatar.png"
                    class="rounded-circle object-fit-cover"
                    style="width: 30px; height: 30px"
                  />
                  <span class="fw-medium text-mute fs-13">No assignee</span>
                </template>
                <template
                  v-else-if="task.created_by?.user_id === task.assigned_to?.user_id"
                >
                  <img
                    :src="task.created_by?.avatar"
                    class="rounded-circle object-fit-cover"
                    style="width: 30px; height: 30px"
                  />
                  <span class="fw-semibold fs-13">{{ task.created_by?.name }}</span>
                  <span class="fw-bold text-mute fs-12">·</span>
                  <span class="text-mute fs-13">Self-assigned the task</span>
                </template>
                <template v-else>
                  <img
                    :src="task.assigned_by?.avatar"
                    class="rounded-circle object-fit-cover"
                    style="width: 30px; height: 30px"
                  />
                  <span class="fw-semibold fs-13">{{ task.assigned_by?.name }}</span>
                  <span class="fw-bold text-mute fs-12">·</span>
                  <span
                    v-if="task.assigned_to?.user_id === getMe.user_id"
                    class="text-mute fs-13"
                    >Assigned to you</span
                  >
                  <span v-else class="text-mute fs-13"
                    >Assigned to {{ task.assigned_to?.name }}</span
                  >
                </template>
              </div>

              <n-popover
                :show="isPopOpen(task.id, 'type')"
                trigger="click"
                placement="bottom-start"
                :show-arrow="false"
                style="border-radius: 12px; padding: 6px; width: 140px"
                @update:show="(val) => (openPop[`${task.id}_type`] = val)"
              >
                <template #trigger>
                  <span
                    class="tab-info w-fit fw-medium cursor-pointer ms-auto d-block"
                    :class="[typeConfig[task.type]?.bg, typeConfig[task.type]?.text]"
                    @click.stop
                  >
                    <Circle
                      size="10"
                      :fill="typeConfig[task.type]?.fill"
                      stroke-width="0"
                    />
                    {{ task.type }}
                  </span>
                </template>
                <div>
                  <div
                    v-for="(cfg, key) in typeConfig"
                    :key="key"
                    class="d-flex align-items-center gap-2 px-2 py-1 rounded workspace-item fs-13 fw-medium cursor-pointer text-capitalize"
                    @click="
                      task.type = key;
                      closePop(task.id, 'type');
                      handleUpdateTask(task, true);
                    "
                  >
                    <Circle size="10" :fill="cfg.fill" stroke-width="0" />
                    {{ key }}
                  </div>
                </div>
              </n-popover>

              <button
                class="icon-action-btn-trash ms-3"
                @click.stop="
                  taskToDelete = task;
                  showDeleteModal = true;
                "
                v-if="isOwner"
              >
                <Trash2 size="18" />
              </button>
            </div>

            <div class="meta-grid mb-3">
              <!-- Status -->
              <div class="meta-item d-flex flex-column gap-2">
                <span class="d-flex align-items-center gap-1 fs-14 text-mute">
                  <circle-dashed size="15" /> Status
                </span>
                <n-popover
                  :show="isPopOpen(task.id, 'status')"
                  trigger="click"
                  placement="bottom-start"
                  :show-arrow="false"
                  :disabled="isStatusLocked(task.status)"
                  style="border-radius: 12px; padding: 6px; width: 160px"
                  @update:show="(val) => (openPop[`${task.id}_status`] = val)"
                >
                  <template #trigger>
                    <span
                      class="tab-info w-fit fw-medium"
                      :class="[
                        statusConfigFull[task.status]?.bg,
                        statusConfigFull[task.status]?.text,
                        isStatusLocked(task.status) ? 'cursor-default' : 'cursor-pointer',
                      ]"
                      @click.stop
                    >
                      <component :is="statusConfigFull[task.status]?.icon" size="16" />
                      {{ statusConfigFull[task.status]?.label }}
                    </span>
                  </template>
                  <div>
                    <div
                      v-for="(cfg, key) in statusConfig"
                      :key="key"
                      class="d-flex align-items-center gap-2 px-2 py-1 rounded workspace-item fs-13 fw-medium cursor-pointer"
                      @click="
                        task.status = key;
                        closePop(task.id, 'status');
                        handleUpdateTask(task, true);
                      "
                    >
                      <component :is="cfg.icon" size="14" />
                      {{ cfg.label }}
                    </div>
                  </div>
                </n-popover>
              </div>

              <!-- Priority -->
              <div class="meta-item d-flex flex-column gap-2">
                <span class="d-flex align-items-center gap-1 fs-14 text-mute">
                  <ghost size="15" /> Priority
                </span>
                <n-popover
                  :show="isPopOpen(task.id, 'priority')"
                  trigger="click"
                  placement="bottom-start"
                  :show-arrow="false"
                  style="border-radius: 12px; padding: 6px; width: 140px"
                  @update:show="(val) => (openPop[`${task.id}_priority`] = val)"
                >
                  <template #trigger>
                    <span
                      class="tab-info w-fit fw-medium cursor-pointer"
                      :class="[
                        priorityConfig[task.priority]?.bg,
                        priorityConfig[task.priority]?.text,
                      ]"
                      @click.stop
                    >
                      <Circle
                        size="10"
                        :fill="priorityConfig[task.priority]?.fill"
                        stroke-width="0"
                      />
                      {{ task.priority }}
                    </span>
                  </template>
                  <div>
                    <div
                      v-for="(cfg, key) in priorityConfig"
                      :key="key"
                      class="d-flex align-items-center gap-2 px-2 py-1 rounded workspace-item fs-13 fw-medium cursor-pointer text-capitalize"
                      @click="
                        task.priority = key;
                        closePop(task.id, 'priority');
                        handleUpdateTask(task, true);
                      "
                    >
                      <Circle size="10" :fill="cfg.fill" stroke-width="0" />
                      {{ key }}
                    </div>
                  </div>
                </n-popover>
              </div>

              <!-- Assignee -->
              <div class="meta-item d-flex flex-column gap-2">
                <span class="d-flex align-items-center gap-1 fs-14 text-mute">
                  <Users size="15" /> Assignee
                </span>
                <n-popover
                  :show="isPopOpen(task.id, 'assignee')"
                  trigger="click"
                  placement="bottom-start"
                  :show-arrow="false"
                  :disabled="!canChangeAssigneeOnUpdate(task)"
                  style="border-radius: 12px; padding: 6px; width: fit-content"
                  @update:show="(val) => (openPop[`${task.id}_assignee`] = val)"
                >
                  <template #trigger>
                    <span
                      class="d-flex align-items-center gap-2 fs-13"
                      style="margin-top: 5px"
                      :class="
                        canChangeAssigneeOnUpdate(task)
                          ? 'cursor-pointer'
                          : 'cursor-default'
                      "
                      @click.stop
                    >
                      <template v-if="!task.assigned_to?.user_id">
                        <img
                          src="../../assets/image/default-avatar.png"
                          class="rounded-circle object-fit-cover"
                          style="width: 22px; height: 22px"
                        />
                        <span class="text-mute">No assignee</span>
                      </template>
                      <template v-else>
                        <img
                          :src="task.assigned_to.avatar"
                          class="rounded-circle object-fit-cover"
                          style="width: 22px; height: 22px"
                        />
                        <n-ellipsis style="max-width: 80px">
                          {{ task.assigned_to.name }}
                        </n-ellipsis>
                        <span
                          v-if="task.assigned_to.user_id === getMe.user_id"
                          class="text-secondary fs-11"
                          >(You)</span
                        >
                      </template>
                    </span>
                  </template>
                  <div>
                    <div
                      v-if="canChangeAssignee"
                      class="d-flex align-items-center gap-2 px-2 py-1 rounded workspace-item fs-13 cursor-pointer"
                      @click="
                        task.assigned_to = null;
                        closePop(task.id, 'assignee');
                        handleUpdateTask(task);
                      "
                    >
                      <img
                        src="../../assets/image/default-avatar.png"
                        class="rounded-circle"
                        style="width: 22px; height: 22px"
                      />
                      <span class="text-mute">No Assignee</span>
                    </div>
                    <div
                      v-for="member in getAssigneeOptions"
                      :key="member.user_id"
                      class="d-flex align-items-center gap-2 px-2 py-1 rounded workspace-item fs-13 cursor-pointer"
                      @click="
                        task.assigned_to = member;
                        closePop(task.id, 'assignee');
                        handleUpdateTask(task, true);
                      "
                    >
                      <img
                        :src="member.avatar"
                        class="rounded-circle object-fit-cover"
                        style="width: 22px; height: 22px"
                      />
                      <n-ellipsis
                        style="max-width: 80px"
                        :tooltip="{
                          keepAliveOnHover: false,
                          style: { pointerEvents: 'none' },
                        }"
                      >
                        {{ member.name }}
                      </n-ellipsis>
                      <span
                        v-if="member.user_id === getMe.user_id"
                        class="text-mute fs-11"
                        >(You)</span
                      >
                      <template v-else>
                        <span v-if="member.role === 'moderator'" class="text-mute fs-11"
                          >(Moderator)</span
                        >
                      </template>
                    </div>
                  </div>
                </n-popover>
              </div>

              <!-- Start Date -->
              <div class="meta-item d-flex flex-column gap-2">
                <span class="d-flex align-items-center gap-1 fs-14 text-mute">
                  <Calendar size="15" /> Start Date
                </span>
                <n-popover
                  :show="isPopOpen(task.id, 'start_date')"
                  trigger="click"
                  placement="bottom-start"
                  :show-arrow="false"
                  style="border-radius: 12px; padding: 0; overflow: hidden"
                  class="start-date"
                  @update:show="(val) => (openPop[`${task.id}_start_date`] = val)"
                >
                  <template #trigger>
                    <span
                      class="fs-13 cursor-pointer rounded-3 date-trigger"
                      style="margin-top: 2px"
                      :class="[
                        task.start_date ? 'text-dark' : 'text-mute',
                        isPopOpen(task.id, 'start_date') ? 'bg-active' : '',
                      ]"
                      @click.stop
                    >
                      {{ task.start_date ? formatDate(task.start_date) : "Set date" }}
                    </span>
                  </template>
                  <div class="custom-picker">
                    <n-date-picker
                      :value="dateToTs(task.start_date)"
                      type="date"
                      :to="false"
                      panel
                      @update:value="
                        (val) => {
                          task.start_date = formatToYMD(val);
                          closePop(task.id, 'start_date');
                          handleUpdateTask(task, true);
                        }
                      "
                    />
                  </div>
                </n-popover>
              </div>

              <!-- End Date -->
              <div class="meta-item d-flex flex-column gap-2">
                <span class="d-flex align-items-center gap-1 fs-14 text-mute">
                  <Calendar size="15" /> End Date
                </span>
                <n-popover
                  :show="isPopOpen(task.id, 'end_date')"
                  trigger="click"
                  placement="bottom-start"
                  :show-arrow="false"
                  style="border-radius: 12px; padding: 0; overflow: hidden"
                  class="end-date"
                  @update:show="(val) => (openPop[`${task.id}_end_date`] = val)"
                >
                  <template #trigger>
                    <span
                      class="fs-13 cursor-pointer rounded-3 date-trigger"
                      style="margin-top: 2px"
                      :class="[
                        task.end_date ? 'text-dark' : 'text-mute',
                        isPopOpen(task.id, 'end_date') ? 'bg-active' : '',
                      ]"
                      @click.stop
                    >
                      {{ task.end_date ? formatDate(task.end_date) : "Set date" }}
                    </span>
                  </template>
                  <div class="custom-picker">
                    <n-date-picker
                      :value="dateToTs(task.end_date)"
                      type="date"
                      :to="false"
                      panel
                      class="custom-picker"
                      @update:value="
                        (val) => {
                          task.end_date = formatToYMD(val);
                          closePop(task.id, 'end_date');
                          handleUpdateTask(task, true);
                        }
                      "
                    />
                  </div>
                </n-popover>
              </div>
            </div>

            <p class="fw-semibold mb-2" style="font-size: 18px">{{ task.title }}</p>
            <p class="mb-0 text-mute fs-15 card-width">
              <n-ellipsis :tooltip="false">
                {{ task.description || "No description provided" }}
              </n-ellipsis>
            </p>
          </div>
        </div>
      </n-scrollbar>
    </template>

    <!-- Delete Modal -->
    <n-modal v-model:show="showDeleteModal" :mask-closable="true">
      <div class="bg-white rounded-card" style="width: 380px">
        <div class="d-flex align-items-center justify-content-between px-4 py-3 pb-2">
          <span class="fw-medium fs-15">Delete Task</span>
          <n-button
            text
            size="small"
            @click="showDeleteModal = false"
            class="hover-circle p-1 rounded-circle"
          >
            <X size="18" />
          </n-button>
        </div>
        <n-divider style="margin: 5px 0; --n-color: #e4e4e7" />
        <div class="px-4 pt-3 pb-3">
          <p class="fs-13 text-mute mb-4 text-center">
            Are you sure you want to delete ?
          </p>
          <div class="d-flex gap-2">
            <button
              class="btn btn-outline border rounded-btn-sm fs-13 fw-medium w-50"
              @click="showDeleteModal = false"
            >
              Cancel
            </button>
            <button
              class="btn btn-danger rounded-btn-sm fs-13 fw-medium w-50"
              @click="handleDeleteTask(taskToDelete)"
            >
              <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
              {{ isLoading ? "Deleting..." : "Delete" }}
            </button>
          </div>
        </div>
      </div>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick, onUnmounted } from "vue";
import {
  CircleCheckBig,
  CircleDashed,
  Send,
  CircleCheck,
  CircleX,
  X,
  FileText,
  Plus,
  UserCheck,
  Ghost,
  Users,
  Calendar,
  Filter,
} from "lucide-vue-next";
import BaseButton from "@/components/BaseButton.vue";
import BaseInput from "@/components/BaseInput.vue";
import { useTaskStore } from "@/stores/user/task";
import { useTeamStore } from "@/stores/user/team";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { notify } from "@/utils/toast";
import { UseWorkspaceStore } from "@/stores/user/workspace";
import TaskSkeleton from "@/components/task/TaskSkeleton.vue";
import TitleTeamSkeleton from "@/components/team/TitleTeamSkeleton.vue";
import { useSubmissionStore } from "@/stores/user/submission";

const route = useRoute();
const router = useRouter();
const toast = notify(router);
const workspace_id = computed(() => route.params.workspace_id);
const team_id = computed(() => route.params.team_id);

const workspaceStore = UseWorkspaceStore();
const { getAllWorkspace } = storeToRefs(workspaceStore);

const taskStore = useTaskStore();
const { getTask, getTaskActivity } = storeToRefs(taskStore);

const teamStore = useTeamStore();
const { getTeamById, getTeamByWorkspace, getMember } = storeToRefs(teamStore);

const authStore = useAuthStore();
const { getMe } = storeToRefs(authStore);

const submissionStore = useSubmissionStore();

const showCreateTask = ref(false);
const isLoading = ref(false);

const showStatusPop = ref(false);
const showPriorityPop = ref(false);
const showTypePop = ref(false);
const showAssigneePop = ref(false);
const showDeleteModal = ref(false);
const showTaskModal = ref(false);
const selectedTask = ref(null);
const originalTask = ref(null);
const showActivity = ref(false);
const showDetailStatusPop = ref(false);
const showDetailPriorityPop = ref(false);
const showDetailTypePop = ref(false);
const showDetailStartDatePop = ref(false);
const showDetailEndDatePop = ref(false);
const showDetailAssigneePop = ref(false);
const taskMessage = ref("");
const taskToDelete = ref(null);

const openPop = ref({});
const isPopOpen = (taskId, field) => !!openPop.value[`${taskId}_${field}`];
const closePop = (taskId, field) => {
  openPop.value[`${taskId}_${field}`] = false;
};

const openTaskModal = async (task) => {
  selectedTask.value = { ...task };
  originalTask.value = { ...task };
  showActivity.value = false;
  showTaskModal.value = true;
  await taskStore.getTaskActivityStore(workspace_id.value, team_id.value, task.id);
  selectedTask.value.activities = getTaskActivity.value;

  await nextTick();
  document.querySelectorAll(".detail-title-input, .detail-desc-input").forEach((el) => {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  });
};

const activeTab = ref("");

const handleTabClick = (status) => {
  activeTab.value = status;
  taskStore.getTaskByTeamStore(workspace_id.value, team_id.value, status);
};

const currentWorkspace = computed(() => {
  return getAllWorkspace.value.find((w) => w.workspace_id == workspace_id.value) ?? null;
});

const isOwner = computed(() => currentWorkspace.value?.my_role === "owner");

const myWorkspaceRole = computed(() => {
  const me = getTeamById.value?.members?.find((m) => m.user_id === getMe.value?.user_id);
  return me?.role ?? "member";
});

const canChangeAssignee = computed(() => {
  return myWorkspaceRole.value === "owner" || myWorkspaceRole.value === "moderator";
});

const canChangeAssigneeOnUpdate = (task) => {
  if (myWorkspaceRole.value === "owner" || myWorkspaceRole.value === "moderator")
    return true;
  return !task.assigned_to?.user_id;
};

const getAssigneeOptions = computed(() => {
  if (myWorkspaceRole.value === "owner") {
    return getTeamById.value.members;
  }
  if (myWorkspaceRole.value === "moderator") {
    return getMember.value;
  }
  return getMember.value.filter((m) => m.user_id === getMe.value?.user_id);
});

const defaultForm = () => ({
  title: "",
  description: "",
  type: "task",
  status: "todo",
  priority: "low",
  assigned_to: null,
  date_range: null,
});

watch(showCreateTask, (val) => {
  if (val) {
    form.value = {
      title: "",
      description: "",
      type: "task",
      status: "todo",
      priority: "low",
      assigned_to: canChangeAssignee.value ? null : getMe.value?.user_id ?? null,
      date_range: null,
    };
  }
});

const form = ref(defaultForm());

const formatToYMD = (timestamp) => {
  if (!timestamp) return null;
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const dateToTs = (dateString) => {
  if (!dateString) return null;
  return new Date(dateString).getTime();
};

const handleCreateTask = async () => {
  if (!form.value.title.trim()) return;
  const payload = {
    title: form.value.title,
    description: form.value.description,
    type: form.value.type,
    status: form.value.status,
    priority: form.value.priority,
    assigned_to: form.value.assigned_to ?? null,
    start_date: formatToYMD(form.value.date_range?.[0]),
    end_date: formatToYMD(form.value.date_range?.[1]),
  };
  try {
    isLoading.value = true;
    form.value = defaultForm();
    await taskStore.createTask(workspace_id.value, team_id.value, payload);
    await taskStore.getTaskByTeamStore(workspace_id.value, team_id.value);
    await taskStore.getSummaryTaskStore(workspace_id.value, team_id.value);
    toast.success("Create Task Successfully");
    showCreateTask.value = false;
  } catch (error) {
    toast.error(error.message);
  } finally {
    isLoading.value = false;
  }
};

const handleUpdateTask = async (task, forceField = null) => {
  try {
    if (!forceField) {
      const titleChanged = task.title !== originalTask.value?.title;
      const descChanged = task.description !== originalTask.value?.description;
      if (!titleChanged && !descChanged) return;
    }

    await taskStore.updateTask(workspace_id.value, team_id.value, task.id, {
      title: task.title,
      description: task.description,
      type: task.type,
      status: task.status,
      priority: task.priority,
      assigned_to: task.assigned_to?.user_id ?? null,
      start_date: task.start_date,
      end_date: task.end_date,
    });

    originalTask.value = { ...task };

    await taskStore.getTaskByTeamStore(workspace_id.value, team_id.value);
    await taskStore.getSummaryTaskStore(workspace_id.value, team_id.value);
    await taskStore.getMyTaskStore(workspace_id.value, team_id.value);
  } catch (error) {
    toast.error(error.message);
    await taskStore.getTaskByTeamStore(workspace_id.value, team_id.value);
  }
};

const handleDeleteTask = async (task) => {
  try {
    isLoading.value = true;
    await taskStore.deleteTask(workspace_id.value, team_id.value, task.id);
    await taskStore.getTaskByTeamStore(workspace_id.value, team_id.value);
    toast.success("Delete Task Successfully");
    showDeleteModal.value = false;
  } catch (error) {
    toast.error(error.message);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await taskStore.getTaskByTeamStore(workspace_id.value, team_id.value);
});

// ── File attachment ──
const fileInputRef = ref(null);
const selectedFile = ref(null);
const filePreviewUrl = ref(null);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const handleFileChange = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const isValid = file.type === "application/pdf" || file.type.startsWith("image/");
  if (!isValid) {
    toast.error("Only image or PDF files are allowed");
    e.target.value = "";
    return;
  }

  if (file.size > MAX_FILE_SIZE) {
    toast.error("File size must be 5MB or less");
    e.target.value = "";
    return;
  }

  selectedFile.value = file;
  e.target.value = "";
};

const removeFile = () => {
  if (filePreviewUrl.value) {
    URL.revokeObjectURL(filePreviewUrl.value);
    filePreviewUrl.value = null;
  }
  selectedFile.value = null;
};

// Generate object URL for images only (used by n-image thumbnail)
watch(selectedFile, (newFile) => {
  if (filePreviewUrl.value) {
    URL.revokeObjectURL(filePreviewUrl.value);
    filePreviewUrl.value = null;
  }
  if (newFile && newFile.type.startsWith("image/")) {
    filePreviewUrl.value = URL.createObjectURL(newFile);
  }
});

// PDF only — open in new tab
const openFilePreview = () => {
  if (!selectedFile.value || selectedFile.value.type !== "application/pdf") return;
  const url = URL.createObjectURL(selectedFile.value);
  window.open(url, "_blank");
};

const handleSubmit = async (task) => {
  if (!task) return;

  if (!selectedFile.value) {
    toast.error("Add attach a file before submitting");
    return;
  }

  if (!taskMessage.value.trim()) {
    toast.error("Add a message before submitting");
    return;
  }

  const formData = new FormData();
  formData.append("message", taskMessage.value);
  if (selectedFile.value) {
    formData.append("file", selectedFile.value);
  }

  try {
    isLoading.value = true;
    await submissionStore.submitTask(
      workspace_id.value,
      team_id.value,
      task.id,
      formData
    );

    // reset state after a successful submit
    taskMessage.value = "";
    removeFile();
    await taskStore.getTaskByTeamStore(workspace_id.value, team_id.value);
    toast.success("Task submitted successfully");
    showTaskModal.value = false;
  } catch (err) {
    toast.error(err.message);
  } finally {
    isLoading.value = false;
  }
};

onUnmounted(() => {
  if (filePreviewUrl.value) URL.revokeObjectURL(filePreviewUrl.value);
});

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${day} / ${month} / ${year}`;
};

const autoResize = (e) => {
  const textarea = e.target;

  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
};

const groupedActivities = computed(() => {
  if (!selectedTask.value?.activities) return [];
  const groups = {};
  for (const act of selectedTask.value.activities) {
    const dateKey = formatDate(act.created_at);
    if (!groups[dateKey]) groups[dateKey] = { date: dateKey, items: [] };
    groups[dateKey].items.push({
      action: act.action,
      note: act.message,
      user: act.created_by,
      time: new Date(act.created_at).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: act.created_at,
    });
  }
  return Object.values(groups);
});

const actTagClass = (action) => {
  const map = {
    create: "act-tag-create",
    assign: "act-tag-assign",
    update: "act-tag-update",
  };
  return map[action?.toLowerCase()] || "act-tag-update";
};

const actTagIcon = (action) => {
  const map = { create: Plus, assign: UserCheck, update: Send };
  return map[action?.toLowerCase()] || Send;
};

const lockedStatuses = ["submitted", "approved", "rejected"];
const isStatusLocked = (status) => lockedStatuses.includes(status);

const statusConfig = {
  todo: { icon: CircleCheckBig, bg: "bg-blue", text: "text-blue", label: "To Do" },
  in_progress: {
    icon: CircleDashed,
    bg: "bg-orange",
    text: "text-orange",
    label: "In Progress",
  },
};

const statusConfigFull = {
  todo: { icon: CircleCheckBig, bg: "bg-blue", text: "text-blue", label: "To Do" },
  in_progress: {
    icon: CircleDashed,
    bg: "bg-orange",
    text: "text-orange",
    label: "In Progress",
  },
  submitted: { icon: Send, bg: "bg-purple", text: "text-purple", label: "Submitted" },
  approved: { icon: CircleCheck, bg: "bg-green", text: "text-green", label: "Approved" },
  rejected: { icon: CircleX, bg: "bg-red", text: "text-danger", label: "Rejected" },
};

const priorityConfig = {
  low: { bg: "bg-gray", text: "text-dark", fill: "#171717" },
  medium: { bg: "bg-orange", text: "text-orange", fill: "#FF8D28" },
  high: { bg: "bg-red", text: "text-danger", fill: "#FF383C" },
  urgent: { bg: "bg-purple", text: "text-purple", fill: "#6155F5" },
};

const typeConfig = {
  bug: { bg: "bg-red", text: "text-danger", fill: "#FF383C" },
  task: { bg: "bg-blue", text: "text-blue", fill: "#0088FF" },
  feature: { bg: "bg-aqua", text: "text-aqua", fill: "#00C3D0" },
  improvement: { bg: "bg-purple", text: "text-purple", fill: "#6155F5" },
};
</script>
<style scoped>
.custom-picker :deep(.n-input) {
  --n-border-hover: 1px solid gray !important;
  --n-border-focus: 1px solid gray !important;
  --n-box-shadow-focus: 0 !important;
  border-radius: 8px !important;
}
.custom-picker :deep(.n-input__input-el) {
  caret-color: #000000 !important;
}
.custom-picker :deep(.n-button--default-type) {
  color: #171717 !important;
  background: #f5f5f5 !important;
  border-radius: 8px !important;
  --n-border-hover: 1px solid gray !important;
  --n-border-focus: 1px solid gray !important;
  --n-border-pressed: 1px solid gray !important;
  --n-text-color-hover: #333 !important;
  --n-color-hover: #f5f5f5 !important;
}
.custom-picker :deep(.n-button--primary-type) {
  background: #171717 !important;
  border-color: #171717 !important;
  color: #fff !important;
  border-radius: 8px !important;
}
.custom-picker :deep(.n-button--primary-type:hover) {
  background: #171717 !important;
  border-color: #171717 !important;
  color: #fff !important;
}
.custom-picker :deep(.n-date-panel) {
  --n-item-color-active: #171717 !important;
  --n-item-color-covered: rgba(23, 23, 23, 0.08) !important;
  --n-item-text-color-active: #fff !important;
  --n-item-color-hover: rgba(23, 23, 23, 0.06) !important;
  --n-item-color-included: rgba(23, 23, 23, 0.08) !important;
  border-radius: 16px !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08) !important;
}
.custom-picker :deep(.n-date-panel-month-calendar__picker-col) {
  height: 185px !important;
  overflow: hidden !important;
}
.custom-picker :deep(.n-date-panel-month-calendar__padding) {
  height: 0 !important;
  min-height: 0 !important;
}
</style>

import React, { FC } from "react";
import { css } from "emotion";
import { genSeedApiTree } from "../generator/generated-api-tree";
import { RoughDivTable, IRoughTableColumn, ActionLinks, IActionLinkItem } from "@jimengio/rough-table";
import { column, rowParted, Space } from "@jimengio/flex-styles";
import { ITask } from "models/alias";
import { JimoButton } from "@jimengio/jimo-basics";
import { useConfirmPop } from "@jimengio/meson-modal";
import { useEditTask } from "./edit-task";
import { useFilterForm, IFilterFieldItem } from "@jimengio/meson-form";

let PageTasks: FC<{ className?: string }> = React.memo((props) => {
  /** Plugins */

  let tasksResource = genSeedApiTree.tasks.useGET();
  let taskDeletion = genSeedApiTree.tasks._.dynamicDELETE();

  let confirmRemove = useConfirmPop({
    text: "Are you sure to remove this?",
  });

  let editPlugin = useEditTask({
    afterChange: () => {
      tasksResource.loadData();
    },
  });

  let filterItems: IFilterFieldItem<ITask>[] = [
    {
      label: "Priority",
      type: "dropdown-select",
      name: "priority",
      allowClear: true,
      options: [
        { display: "1", value: 1 },
        { display: "2", value: 2 },
        { display: "3", value: 3 },
        { display: "4", value: 4 },
        { display: "5", value: 5 },
      ],
    },
  ];

  let filterForm = useFilterForm({
    items: filterItems,
    onItemChange: () => {
      console.log("TODO");
      tasksResource.loadData();
    },
  });

  /** Methods */
  /** Effects */
  /** Renderers */

  let columns: IRoughTableColumn<ITask>[] = [
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Priority",
      dataIndex: "priority",
    },
    {
      title: "Content",
      dataIndex: "content",
      clampText: true,
    },
    {
      title: "Operations",
      dataIndex: "id",
      render: (id: string, record) => {
        let actions: IActionLinkItem[] = [
          {
            text: "Edit",
            onClick: () => {
              editPlugin.edit(record);
            },
          },
          {
            text: "Remove",
            onClick: async () => {
              if (await confirmRemove.forConfirmation()) {
                await taskDeletion.request({ id: id });
                tasksResource.loadData();
              }
            },
          },
        ];
        return <ActionLinks actions={actions} />;
      },
    },
  ];

  return (
    <div className={props.className}>
      <div className={rowParted}>
        <JimoButton
          text={"Add"}
          fillColor
          onClick={() => {
            editPlugin.create();
          }}
        />
      </div>

      <Space height={12} />
      {filterForm.ui}
      <Space height={12} />
      <RoughDivTable data={tasksResource.result} isLoading={tasksResource.isLoading} columns={columns} />
      {confirmRemove.ui}
      {editPlugin.ui}
    </div>
  );
});

export default PageTasks;

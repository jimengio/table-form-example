import React, { FC } from "react";
import { css } from "emotion";
import { genSeedApiTree } from "../generator/generated-api-tree";
import { RoughDivTable, IRoughTableColumn, ActionLinks, IActionLinkItem } from "@jimengio/rough-table";
import { column, rowParted, Space } from "@jimengio/flex-styles";
import { ITask } from "models/alias";
import { JimoButton } from "@jimengio/jimo-basics";
import { useConfirmPop } from "@jimengio/meson-modal";

let PageTasks: FC<{ className?: string }> = React.memo((props) => {
  /** Plugins */

  let tasksResource = genSeedApiTree.tasks.useGET();

  let confirmRemove = useConfirmPop({
    text: "Are you sure to remove this?",
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
    },
    {
      title: "Operations",
      dataIndex: "id",
      render: () => {
        let actions: IActionLinkItem[] = [
          {
            text: "Edit",
            onClick: () => {
              // TODO
            },
          },
          {
            text: "Remove",
            onClick: async () => {
              if (await confirmRemove.forConfirmation()) {
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
            // TODO
          }}
        />
      </div>
      <Space height={12} />
      <RoughDivTable data={tasksResource.result} isLoading={tasksResource.isLoading} columns={columns} />
      {confirmRemove.ui}
    </div>
  );
});

export default PageTasks;
